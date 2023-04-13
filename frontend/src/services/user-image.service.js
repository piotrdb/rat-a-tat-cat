import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "https://ratsapi.online/api/";

const getImagesIds = () => {
    return axios.get(API_URL + "users/AvailableImages", { headers: authHeader() });
};

const postProfileImage = (body) => {
    console.log(body)
    return axios.put(API_URL + "users/user/image/" + body.userId, body, { headers: authHeader() });
};


const userImageService = {
    getImagesIds,
    postProfileImage
};

export default userImageService;
