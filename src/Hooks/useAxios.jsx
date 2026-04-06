import axios from 'axios';
import React from 'react';


const axiosInstance = axios.create({
    baseURL: 'https://assignment-12-serverside-one.vercel.app'
})

const useAxios = () => {
    return axiosInstance;
};

export default useAxios;