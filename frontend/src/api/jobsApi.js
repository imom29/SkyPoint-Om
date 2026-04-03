import axiosInstance from "./axiosInstance";

export async function getJobs(params = {}) {
  const res = await axiosInstance.get("/jobs", { params });
  return res.data;
}

export async function getJob(id) {
  const res = await axiosInstance.get(`/jobs/${id}`);
  return res.data;
}

export async function getMyJobs() {
  const res = await axiosInstance.get("/jobs/my");
  return res.data;
}

export async function createJob(data) {
  const res = await axiosInstance.post("/jobs", data);
  return res.data;
}

export async function updateJob(id, data) {
  const res = await axiosInstance.put(`/jobs/${id}`, data);
  return res.data;
}

export async function deleteJob(id) {
  await axiosInstance.delete(`/jobs/${id}`);
}
