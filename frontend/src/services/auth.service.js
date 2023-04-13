import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "https://ratsapi.online/api/";

const getRankingListing = () => {
  return axios.get(`${API_URL}users/ranking`, { headers: authHeader() })
}

const updateUser = (userInfo) => {
  return axios.put(`${API_URL}users/${userInfo.userId}`, userInfo, { headers: authHeader() });
}

const updateEmail = (email) => {
  return axios.put(`${API_URL}users/email`, { newEmail: email }, { headers: authHeader() });
}

const updateDisplayName = (displayName) => {
  return axios.put(`${API_URL}users/DisplayName`, { name: displayName }, { headers: authHeader() });
}

const updatePassword = (data) => {
  return axios.put(`${API_URL}users/password`, data, { headers: authHeader() });
}

const register = (username, email, password) => {
  return axios.post(API_URL + "users", {
    username,
    email,
    password,
    "displayName": username,
  });
};

const login = (email, password) => {
  return axios
    .post(API_URL + "token", {
      email,
      password,
    })
    .then((response) => {
      if (response.data) {
        localStorage.setItem("token", JSON.stringify(response.data));
      }
      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("token");
};

const authService = {
  getRankingListing,
  updateUser,
  updateEmail,
  updatePassword,
  updateDisplayName,
  register,
  login,
  logout,
};

export default authService;