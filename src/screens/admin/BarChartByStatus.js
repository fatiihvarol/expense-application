import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { fetchBarChartByStatus } from "../../services/ReportService"; // API function to fetch chart data
import { jwtDecode } from "jwt-decode";
import { TOKENROLEPATH, USERROLE } from "../../config/Constants";
import Navbar from "../../components/Navbar";
import ProtectedRoute from "../../components/ProtectedRoute";
import { Box, CircularProgress } from "@mui/material";

const BarChartByStatus = () => {
  const [dataset, setDataset] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch bar chart data from the backend
    fetchBarChartByStatus()
      .then((data) => {
        // Transform the data for BarChart
        const transformedData = data.result.map((item) => ({
          status: item.status,
          ...item.amountsByCurrency, // Spread dynamic currency values for the first chart
          count: item.count, // For the second chart
        }));

        // Set dataset and extract unique currencies for the first chart
        setDataset(transformedData);

        // Get all unique currencies from the dataset for the first chart
        const uniqueCurrencies = Array.from(
          new Set(
            data.result.flatMap((item) => Object.keys(item.amountsByCurrency))
          )
        );

        setCurrencies(uniqueCurrencies);
        setLoading(false);
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

  const countChartSetting = {
    yAxis: [
      {
        label: "Count",
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
  if (loading) {
    return (
      <Box className="centered">
        <CircularProgress />
      </Box>
    );
  }
  return (
    <div className="bar-chart-report">
      <Navbar
        userRole={jwtDecode(localStorage.getItem("token"))[TOKENROLEPATH]}
      />
      <div className="chart-container">
        <div className="title">Bar Chart - Amounts by Currency</div>
        {/* First BarChart: Amounts by Currency */}
        <div className="chart-wrapper">
          <BarChart
            dataset={dataset}
            xAxis={[{ scaleType: "band", dataKey: "status" }]} // Status for x-axis
            series={currencies.map((currency) => ({
              dataKey: currency,
              label: currency.toUpperCase(), // Capitalize currency codes
            }))}
            {...chartSetting}
          />
        </div>
      </div>

      <div className="chart-container">
        <div className="title">Bar Chart - Transaction Counts</div>
        {/* Second BarChart: Transaction Counts */}
        <div className="chart-wrapper">
          <BarChart
            dataset={dataset}
            xAxis={[{ scaleType: "band", dataKey: "status" }]} // Status for x-axis
            series={[
              {
                dataKey: "count",
                label: "Transaction Count",
              },
            ]}
            {...countChartSetting}
          />
        </div>
      </div>
    </div>
  );
};

export default () => (
  <ProtectedRoute
    allowedRoles={ USERROLE[3]}
  >
    <BarChartByStatus />
  </ProtectedRoute>
);
