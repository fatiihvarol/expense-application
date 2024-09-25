import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { fetchBarChart } from "../../services/ReportService"; // API function to fetch chart data
import { jwtDecode } from "jwt-decode";
import { TOKENROLEPATH, USERROLE } from "../../config/Constants";
import Navbar from "../../components/Navbar";
import "../../styles/Report/Chart.css"; // Import the CSS for styling
import ProtectedRoute from "../../components/ProtectedRoute";

const BarChartReport= ()=> {
  const [dataset, setDataset] = useState([]);
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    // Fetch bar chart data from the backend
    fetchBarChart()
      .then((data) => {
        // Transform the data for BarChart
        const transformedData = data.result.map((item) => ({
          category: item.categoryName,
          ...item.amountsByCurrency, // Spread dynamic currency values
        }));

        // Set dataset and extract unique currencies for series
        setDataset(transformedData);

        // Get all unique currencies from the dataset
        const uniqueCurrencies = Array.from(
          new Set(
            data.result.flatMap((item) => Object.keys(item.amountsByCurrency))
          )
        );

        setCurrencies(uniqueCurrencies);
      })
      .catch((error) => {
        console.error("Error fetching bar chart data:", error);
      });
  }, []);

  const chartSetting = {
    yAxis: [
      {
        label: "Amount",
      },
    ],
    width: 600,
    height: 400,
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: "translate(-20px, 0)",
      },
    },
  };

  return (
    <div className="bar-chart-report">
      <Navbar
        userRole={jwtDecode(localStorage.getItem("token"))[TOKENROLEPATH]}
      />
      <div className="chart-container">
        <div className="title">BAR CHART REPORT</div>
        <div className="chart-wrapper">
          <BarChart
            dataset={dataset}
            xAxis={[{ scaleType: "band", dataKey: "category" }]}
            series={currencies.map((currency) => ({
              dataKey: currency,
              label: currency.toUpperCase(), // Capitalize currency codes
            }))}
            {...chartSetting}
          />
        </div>

        {/* Display expenses below the chart */}
        <div className="expenses-list">
          <div className="title">TOTAL EXPENSES BY CATEGORY</div>
          {dataset.map((item, index) => (
            <div key={index} className="expense-item">
              <span className="category-name">{item.category}:</span>
              {currencies.map((currency) => (
                <span key={currency} className="currency-value">
                  {currency.toUpperCase()}: {item[currency] || 0}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default () => (
  <ProtectedRoute
    allowedRoles={[USERROLE[0], USERROLE[1], USERROLE[2], USERROLE[3]]}
  >
    <BarChartReport />
  </ProtectedRoute>
);
