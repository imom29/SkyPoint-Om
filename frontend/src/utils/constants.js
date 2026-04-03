export const JOB_TYPES = [
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "contract", label: "Contract" },
];

export const APPLICATION_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
];

export const JOB_TYPE_LABELS = Object.fromEntries(JOB_TYPES.map((t) => [t.value, t.label]));
export const STATUS_LABELS = Object.fromEntries(APPLICATION_STATUSES.map((s) => [s.value, s.label]));
