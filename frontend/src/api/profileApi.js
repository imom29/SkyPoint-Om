import axiosInstance from "./axiosInstance";

export async function getProfile() {
  const res = await axiosInstance.get("/profile");
  return res.data;
}

export async function updateProfile(data) {
  const res = await axiosInstance.put("/profile", data);
  return res.data;
}

export async function getCandidateProfile(candidateId) {
  const res = await axiosInstance.get(`/profile/candidate/${candidateId}`);
  return res.data; // null if candidate hasn't built a profile yet
}
