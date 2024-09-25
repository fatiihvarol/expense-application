import axios from "axios";
import { BASEURL } from "../config/Constants";

const BASEREPORTURL = `${BASEURL}/Reports`;

export const fetchPieChart = async () => {
    try {
        const response = await axios.get(`${BASEREPORTURL}/PieChart`);
        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : 'Failed to fetch expense');
    }
};

export const fetchBarChart = async () => {
    try {
        const response = await axios.get(`${BASEREPORTURL}/BarChart`);
        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : 'Failed to fetch bar chart data');
    }
};