import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5005/api",
});

export const signupService = (requestBody) => {
  return api.post("/auth/signup", requestBody);
};

export const loginService = (requestBody) => {
  return api.post("/auth/login", requestBody);
};

export const verifyService = (token) => {
  return api.get("/auth/verify", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};