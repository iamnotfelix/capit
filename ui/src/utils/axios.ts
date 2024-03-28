import axios from "axios";

const axiosService = axios.create({
  baseURL: "http://192.168.100.84:8000/",
  headers: {
    // set this to json so graphQl calls work
    "Content-Type": "application/json",
  },
});

axiosService.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error);
    console.log(error.response.data);
    throw error;
  }
);

export default axiosService;
