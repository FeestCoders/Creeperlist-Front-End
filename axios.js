import axios from 'axios';
import store from "./redux";

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_api
});

export default instance;
