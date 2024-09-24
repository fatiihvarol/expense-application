import axios from "axios";
const CATEGORYURL = "https://localhost:7295/api/ExpenseCategories"

export const fetchCategories = async() =>
    {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${CATEGORYURL}`, 
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