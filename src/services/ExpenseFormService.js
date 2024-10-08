import axios from 'axios';
import { BASEURL, TOKENROLEPATH } from '../config/Constants'; 
import { jwtDecode } from 'jwt-decode';

const CREATE_EXPENSE_URL = `${BASEURL}/ExpenseForms/Create`; 
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

export const fetchExpensesByRole = async () => {
    try {
   
        const token = localStorage.getItem('token');
        const role = jwtDecode(token)[TOKENROLEPATH]
        let endpoint;
    switch (role) {
        case 'Employee':
            endpoint = `${BASE_EXPENSE_URL}/GetMyExpenseForms`;
            break;
        case 'Manager':
            endpoint = `${BASE_EXPENSE_URL}/ByManager`;
            break;
        case 'Accountant':
            endpoint = `${BASE_EXPENSE_URL}/ByAccountant`;
            break;
        case 'Admin':
            endpoint = `${BASE_EXPENSE_URL}/ByAdmin`;
            break;
        default:
            throw new Error('Invalid role');
    }


        const response = await axios.get(endpoint, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }); 
        return response.data;
    } 
    catch (error) {
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

export const rejectExpense = async (id,rejectionDescription) => 
{
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${BASE_EXPENSE_URL}/Reject/${id}`, rejectionDescription,{
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : 'Failed to reject expense');
    }
}
export const approveExpense = async(id) =>
{
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(
            `${BASE_EXPENSE_URL}/Approve/${id}`, 
            {}, // Eğer PUT isteğinde veri göndermiyorsanız boş obje verin
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : 'Failed to approve expense');
    }
}

export const payExpense = async(id) =>
    {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${BASE_EXPENSE_URL}/Pay/${id}`, 
                {}, 
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            return response.data;
        } catch (error) {
            throw new Error(error.response ? error.response.data.message : 'Failed to pay expense');
        }
    }

    export const employeeInfo = async() =>
    {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${BASE_EXPENSE_URL}/GetEmployeeExpenseInfo`, 
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            return response.data;
        } catch (error) {
            throw new Error(error.response ? error.response.data.message : 'Failed to get info');
        }
    }

