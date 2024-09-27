import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchExpenseFormHistory } from "../../services/ExpenseFormHistoryService";

import Navbar from "../../components/Navbar";
import { USERROLE } from "../../config/Constants";
import CircularProgress from "@mui/material/CircularProgress"; // CircularProgress bileşenini ekleyin
import ProtectedRoute from "../../components/ProtectedRoute";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import '../../styles/ExpenseFormHistory.css'
import { Box } from "@mui/material";

const ExpenseFormHistory = () => {
  const { id } = useParams();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true); // Loading durumu
  const pagination = true;
  const paginationPageSize = 10;
  const paginationPageSizeSelector = [10, 20, 50];
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Veriyi çekmeden önce loading durumunu true yap
      try {
        const response = await fetchExpenseFormHistory(id);
        setHistory(response.result);
      } catch (error) {
        console.error("Failed to fetch expense form history:", error);
      } finally {
        setLoading(false); // Veriyi çektikten sonra loading durumunu false yap
      }
    };

    fetchData();
  }, [id]);

  // Tarih ve saat formatlayan fonksiyon
  const formatDateTime = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-En', options); // Türkçe format
  };
  
  const colDefs = [
    {
      field: "id",
      headerName: "Transaction Id",
      filter: true,
      floatingFilter: true,
    },
    {
      field: "madeBy",
      headerName: "User Id",
      filter: true,
      floatingFilter: true,
    },
    {
      field: "fullName",
      headerName: "Full Name",
      filter: true,
      floatingFilter: true,
    },
    {
      field: "action",
      headerName: "Transaction Action",
      cellClass: (params) => `status-${params.value.toLowerCase()}`,

      filter: true,
      floatingFilter: true,
    },
    {
      field: "date",
      headerName: "Transaction Date",
      valueGetter: (params) => formatDateTime(params.data.date),
      filter: "agTextColumnFilter", // Metinle filtreleme
      floatingFilter: true, // Yüzen filtreyi etkinleştir
      filterParams: {
        // Filtre için parametreler
        filterOptions: ['contains'], // Sadece "contains" seçeneğini göster
        textFormatter: (text) => text.trim().toLowerCase(), // Metin düzenleme
      },
    },
  ];
  const formatCreatedDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-En', options); // Türkçe format
  };
  if (loading) {
    return (
      <Box className="centered">
        <CircularProgress />
      </Box>
    );
  }
  return (
    <div>
      <Navbar userRole={USERROLE[3]} />
      <div className="table-container">
        <div
          className="ag-theme-quartz"
          style={{ height: 500, width: "87%" }}
        >
          <AgGridReact
            rowData={history}
            columnDefs={colDefs}
            pagination={pagination}
            paginationPageSize={paginationPageSize}
            paginationPageSizeSelector={paginationPageSizeSelector}
     
    
          />
        </div>
      </div>
    </div>
  );
  
};

export default () => (
  <ProtectedRoute
    allowedRoles={[USERROLE[0], USERROLE[1], USERROLE[2], USERROLE[3]]}
  >
    <ExpenseFormHistory />
  </ProtectedRoute>
);
