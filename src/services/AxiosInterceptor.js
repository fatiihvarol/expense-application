import axios from 'axios';
import { BASEURL } from '../config/Constants';

const REFRESHTOKENURL = `${BASEURL}/Auth/Refresh`;

const login = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');

        const response = await axios.post(REFRESHTOKENURL, { refreshToken });

        if (response.data.isSuccess) {
            localStorage.setItem("token", response.data.result.token);
            localStorage.setItem("refreshToken", response.data.result.refreshToken);
            localStorage.setItem("expiresAt", response.data.result.expiresAt);
        } else {
            throw new Error("Token refresh failed");
        }
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : 'Login failed');
    }
};

// Axios response interceptor to handle 401 errors
axios.interceptors.response.use(
    response => response, 
    async error => {
        if (error.response && error.response.status === 401) {
            try {
                await login(); // Attempt to refresh token
                error.config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
                return axios(error.config); // Retry the failed request
            } catch (refreshError) {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('expiresAt');
                window.location.href = '/login';  
                alert("Your session expired. Please log in again.");
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);
