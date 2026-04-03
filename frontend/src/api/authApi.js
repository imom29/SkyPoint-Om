import axiosInstance from "./axiosInstance";

export async function register(data) {
  const res = await axiosInstance.post("/auth/register", data);
  return res.data;
}

export async function login(email, password) {
  const form = new URLSearchParams();
  form.append("username", email);
  form.append("password", password);
  const res = await axiosInstance.post("/auth/login", form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return res.data;
}
