import axios from "axios";
import { store } from "../redux/store";
import { removeToken } from "../redux/slices/tokenSlice";

export const baseUrl = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
      },
});

baseUrl.interceptors.request.use((config) => {
    const state = store.getState();
    const token = state.token?.item?.access_token;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

baseUrl.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            store.dispatch(removeToken());
            alert("Your session has expired. Please log in again.");
        }
        return Promise.reject(error);
    }
);
