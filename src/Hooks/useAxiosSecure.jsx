import axios from "axios";

const axiosSecure = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, // 🔥 VERY IMPORTANT
});

const useAxiosSecure = () => {
  return axiosSecure;
};

export default useAxiosSecure;