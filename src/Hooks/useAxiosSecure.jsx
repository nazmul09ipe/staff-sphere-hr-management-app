import axios from "axios";

const axiosSecure = axios.create({
  baseURL: "https://assignment-12-serverside-one.vercel.app",
  withCredentials: true, // 🔥 VERY IMPORTANT
});

const useAxiosSecure = () => {
  return axiosSecure;
};

export default useAxiosSecure;