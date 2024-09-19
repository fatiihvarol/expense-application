import axios from 'axios';
import { BASEURL } from '../config/Constants'; 

const API_URL = `${BASEURL}/ExpenseForms/GetAllExpenseForms`;

export const test = async () => {
    try {
       
        const token = localStorage.getItem('token');

        // İsteği gönderirken token'ı Authorization başlığına ekle
        const response = await axios.get(API_URL, 
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : 'Login failed');
    }
};
