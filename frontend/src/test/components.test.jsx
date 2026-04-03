import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Badge from "../components/common/Badge";
import JobCard from "../components/jobs/JobCard";
import JobFilters from "../components/jobs/JobFilters";
import ProtectedRoute from "../components/common/ProtectedRoute";
import RoleGuard from "../components/common/RoleGuard";
import ApplicationCard from "../components/applications/ApplicationCard";

// --- Badge ---
describe("Badge", () => {
  it("renders label with correct class for accepted status", () => {
    const { container } = render(<Badge value="accepted" label="Accepted" />);
    expect(screen.getByText("Accepted")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("bg-green-100");
  });

  it("renders correct class for rejected status", () => {
    const { container } = render(<Badge value="rejected" label="Rejected" />);
    expect(container.firstChild).toHaveClass("bg-red-100");
  });

  it("renders correct class for pending status", () => {
    const { container } = render(<Badge value="pending" label="Pending" />);
    expect(container.firstChild).toHaveClass("bg-yellow-100");
  });

  it("renders correct class for full_time job type", () => {
    const { container } = render(<Badge value="full_time" label="Full Time" />);
    expect(container.firstChild).toHaveClass("bg-blue-100");
  });
});

// --- JobCard ---
const mockJob = {
  id: "job-1",
  title: "Software Engineer",
  location: "Remote",
  job_type: "full_time",
  salary_min: 80000,
  salary_max: 120000,
  application_count: 5,
  created_at: "2026-01-01T00:00:00Z",
  posted_by: { full_name: "Admin HR" },
};

describe("JobCard", () => {
  it("renders job title as a link", () => {
    render(<MemoryRouter><JobCard job={mockJob} /></MemoryRouter>);
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
  });

  it("renders job location", () => {
    render(<MemoryRouter><JobCard job={mockJob} /></MemoryRouter>);
    expect(screen.getByText("Remote")).toBeInTheDocument();
  });

  it("renders formatted salary", () => {
    render(<MemoryRouter><JobCard job={mockJob} /></MemoryRouter>);
    expect(screen.getByText("$80k – $120k")).toBeInTheDocument();
  });

  it("renders applicant count", () => {
    render(<MemoryRouter><JobCard job={mockJob} /></MemoryRouter>);
    expect(screen.getByText("5 applicants")).toBeInTheDocument();
  });

  it("shows 'View details' link pointing to correct path", () => {
    render(<MemoryRouter><JobCard job={mockJob} /></MemoryRouter>);
    const link = screen.getByText(/view details/i).closest("a");
    expect(link).toHaveAttribute("href", "/jobs/job-1");
  });
});

// --- JobFilters ---
describe("JobFilters", () => {
  it("calls onChange when title input changes", () => {
    const onChange = vi.fn();
    render(<JobFilters filters={{ title: "", location: "", job_type: "" }} onChange={onChange} />);
    fireEvent.change(screen.getByPlaceholderText(/search by title/i), {
      target: { value: "Engineer" },
    });
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ title: "Engineer" }));
  });

  it("calls onChange when job type changes", () => {
    const onChange = vi.fn();
    render(<JobFilters filters={{ title: "", location: "", job_type: "" }} onChange={onChange} />);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "contract" } });
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ job_type: "contract" }));
  });

  it("shows clear button when filters are active", () => {
    render(
      <JobFilters filters={{ title: "Dev", location: "", job_type: "" }} onChange={vi.fn()} />
    );
    expect(screen.getByText("Clear")).toBeInTheDocument();
  });

  it("hides clear button when no filters active", () => {
    render(
      <JobFilters filters={{ title: "", location: "", job_type: "" }} onChange={vi.fn()} />
    );
    expect(screen.queryByText("Clear")).not.toBeInTheDocument();
  });
});

// --- ProtectedRoute ---
function makeAuthContext(isAuthenticated) {
  return {
    isAuthenticated,
    user: isAuthenticated ? { id: "1", full_name: "Test", role: "candidate" } : null,
    token: isAuthenticated ? "tok" : null,
    login: vi.fn(),
    logout: vi.fn(),
  };
}

describe("ProtectedRoute", () => {
  it("renders children when authenticated", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={makeAuthContext(true)}>
          <ProtectedRoute><div>Protected Content</div></ProtectedRoute>
        </AuthContext.Provider>
      </MemoryRouter>
    );
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("redirects to /login when not authenticated", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AuthContext.Provider value={makeAuthContext(false)}>
          <ProtectedRoute><div>Protected Content</div></ProtectedRoute>
        </AuthContext.Provider>
      </MemoryRouter>
    );
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });
});

// --- RoleGuard ---
function makeRoleContext(role) {
  return {
    isAuthenticated: true,
    user: { id: "1", full_name: "Test", role },
    token: "tok",
    login: vi.fn(),
    logout: vi.fn(),
  };
}

describe("RoleGuard", () => {
  it("renders children for correct role", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={makeRoleContext("hr")}>
          <RoleGuard allowedRoles={["hr"]}><div>HR Content</div></RoleGuard>
        </AuthContext.Provider>
      </MemoryRouter>
    );
    expect(screen.getByText("HR Content")).toBeInTheDocument();
  });

  it("redirects for wrong role", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={makeRoleContext("candidate")}>
          <RoleGuard allowedRoles={["hr"]}><div>HR Content</div></RoleGuard>
        </AuthContext.Provider>
      </MemoryRouter>
    );
    expect(screen.queryByText("HR Content")).not.toBeInTheDocument();
  });
});

// --- ApplicationCard ---
const mockApplication = {
  id: "app-1",
  job: { id: "job-1", title: "Senior Engineer", location: "Remote", job_type: "full_time" },
  status: "accepted",
  applied_at: "2026-01-15T00:00:00Z",
};

describe("ApplicationCard", () => {
  it("renders job title", () => {
    render(<MemoryRouter><ApplicationCard application={mockApplication} /></MemoryRouter>);
    expect(screen.getByText("Senior Engineer")).toBeInTheDocument();
  });

  it("renders accepted badge", () => {
    render(<MemoryRouter><ApplicationCard application={mockApplication} /></MemoryRouter>);
    expect(screen.getByText("Accepted")).toBeInTheDocument();
  });

  it("renders applied date", () => {
    render(<MemoryRouter><ApplicationCard application={mockApplication} /></MemoryRouter>);
    expect(screen.getByText(/applied/i)).toBeInTheDocument();
  });
});
