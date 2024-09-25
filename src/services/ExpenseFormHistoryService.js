import axios from "axios";
import { BASEURL } from "../config/Constants";


const HISTORYURL = `${BASEURL}/ExpenseFormHistories`;

export const fetchExpenseFormHistory = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${HISTORYURL}/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(
      error.response ? error.response.data.message : "Failed to fetch history"
    );
  }
};
