import React, { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { jwtDecode } from "jwt-decode";
import Navbar from "../../components/Navbar";
import { fetchPieChart } from "../../services/ReportService";
import { TOKENROLEPATH, USERROLE } from "../../config/Constants";
import "../../styles/Report/Chart.css"; // CSS dosyasını dahil ediyoruz
import ProtectedRoute from "../../components/ProtectedRoute";

const  PieChartReport =()=> {
  const [data, setData] = useState([]);

  // Veri çekme işlemi useEffect içinde
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchPieChart();
        if (response.isSuccess && response.result) {
          // Backend'den gelen veriyi PieChart formatına uygun hale getiriyoruz
          const chartData = response.result.map((item, index) => ({
            id: item.id,
            value: item.totalAmount,
            label: item.categoryName,
          }));
          setData(chartData);
        }
      } catch (error) {
        console.error("Failed to fetch pie chart data:", error);
      }
    };

    fetchData();
  }, []); // Sayfa yüklendiğinde veri çekme işlemi yapılacak

  return (
    <div>
      <Navbar
        userRole={jwtDecode(localStorage.getItem("token"))[TOKENROLEPATH]}
      />
      <div className="chart-container">
        <div className="title">PIE CHART</div>
        {/* PieChart bileşeni dinamik veriyi kullanıyor */}
        <div className="chart-wrapper">
          <PieChart
            series={[
              {
                data: data, // Dinamik olarak backend'den çekilen veri
              },
            ]}
            width={600}
            height={300}
          />
        </div>

        {/* Harcamaları sayısal olarak listeleme */}
        <div className="expenses-list">
          <div className="title">TOTAL EXPENSES</div>
          {data.map((item) => (
            <div key={item.id} className="expense-item">
              <span className="category-name">
                {item.label} Expenses : {item.value}
              </span>
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
    <PieChartReport />
  </ProtectedRoute>
);
