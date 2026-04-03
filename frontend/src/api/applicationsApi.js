import axiosInstance from "./axiosInstance";

export async function applyToJob(data) {
  const res = await axiosInstance.post("/applications", data);
  return res.data;
}

export async function getMyApplications() {
  const res = await axiosInstance.get("/applications/my");
  return res.data;
}

export async function getJobApplications(jobId) {
  const res = await axiosInstance.get(`/applications/job/${jobId}`);
  return res.data;
}

export async function updateApplicationStatus(appId, status) {
  const res = await axiosInstance.patch(`/applications/${appId}/status`, { status });
  return res.data;
}

export async function getApplication(appId) {
  const res = await axiosInstance.get(`/applications/${appId}`);
  return res.data;
}
