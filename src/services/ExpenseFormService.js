import axios from 'axios';
import { BASEURL } from '../config/Constants'; 

const CREATE_EXPENSE_URL = `${BASEURL}/ExpenseForms/Create`; 
const MY_EXPENSES_URL = `${BASEURL}/ExpenseForms/GetMyExpenseForms`; 
const GETEXPENSEBYID = `${BASEURL}/ExpenseForms`; 
const DELETEEXPENSE = `${BASEURL}/ExpenseForms`; 

export const submitExpenses = async (data) => {
    try {
      
        const token = localStorage.getItem('token');
        

        const response = await axios.post(CREATE_EXPENSE_URL, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.data.isSuccess) {
            throw new Error('Failed to submit expenses');
        }

        return response.data; // Harcama gönderim cevabı döner
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : 'Failed to submit expenses');
    }
};

export const fetchMyExpenses = async () => {
    try {
        // Local storage'dan token'ı al
        const token = localStorage.getItem('token'); // Token'ı buradan alıyoruz

        // MyExpenses isteğini yap
        const response = await axios.get(MY_EXPENSES_URL, {
            headers: {
                'Authorization': `Bearer ${token}` // Bearer token formatında ekle
            }
        });

        return response.data; // Harcama listesi döner
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : 'Failed to fetch expenses');
    }
};


const BASE_EXPENSE_URL = `${BASEURL}/ExpenseForms`;

export const fetchExpenseById = async (id) => {
    try {
        const response = await axios.get(`${BASE_EXPENSE_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : 'Failed to fetch expense');
    }
};

export const updateExpense = async (id, data) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${BASE_EXPENSE_URL}/${id}`, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : 'Failed to update expense');
    }
};
export const GetxpenseById = async (id) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${GETEXPENSEBYID}/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : 'Failed to update expense');
    }
};

export const DeleteExpense = async (id) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${DELETEEXPENSE}/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : 'Failed to delete expense');
    }
};


