import React from 'react';
import { test } from '../../services/Test';
const EmployeeDashboard = () => {
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = await test();

            if (data.isSuccess) {

                console.log(data);
            } else {
                alert('Email or Password incorrect');
            }
        } catch (error) {
        }
    };
    return (
        <div className="dashboard-container">
            <h1>Welcome to the EMPLOYEE Dashboard</h1>
            <p>This is the main page after login.</p>
            <button onClick={handleSubmit}>click</button>
        </div>
    );
};

export default EmployeeDashboard;
