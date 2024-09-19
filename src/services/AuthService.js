import axios from 'axios';
import { BASEURL } from '../config/Constants'; 

const API_URL = `${BASEURL}/Auth/login`;

export const login = async (email, password) => {
    try {
        const response = await axios.post(API_URL, { email, password });
        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : 'Login failed');
    }
};
