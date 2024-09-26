import React, { useEffect, useState } from "react";
import { fetchExpensesByRole } from "../services/ExpenseFormService";
import { useNavigate } from "react-router-dom";
import "../styles/ExpenseList.css";
import Navbar from "./Navbar";
import { TOKENROLEPATH, USERROLE } from "../config/Constants";
import ProtectedRoute from "./ProtectedRoute";
import { jwtDecode } from "jwt-decode";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterCurrency, setFilterCurrency] = useState("All");
  const navigate = useNavigate();
  const pagination = true;
  const paginationPageSize = 500;
  const paginationPageSizeSelector = [200, 500, 1000];
  useEffect(() => {
    const getExpenses = async () => {
      try {
        const response = await fetchExpensesByRole();
        if (response.isSuccess) {
          setExpenses(response.result);
        } else {
          alert(response);
          navigate("/login");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getExpenses(); // Yalnızca bileşen ilk yüklendiğinde çağrılır
  }, []); // Boş bağımlılık dizisi

  const handleEdit = (id) => {
    navigate(`/edit-expense/${id}`);
  };

  if (loading) {
    return (
      <Box className="centered">
        <CircularProgress />
      </Box>
    );
  }

  if (error) return <p className="error">{error}</p>;

  const filteredExpenses = expenses.filter((expense) => {
    const matchesStatus =
      filterStatus === "All" || expense.expenseStatus === filterStatus;

    const matchesCurrency =
      filterCurrency === "All" || expense.currency === filterCurrency;

    return matchesStatus && matchesCurrency;
  });

  const colDefs = [
    {
      field: "employeeId",
      headerName: "Employee No",
      filter: true,
      floatingFilter: true,
    },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      filter: true,
      floatingFilter: true,
    },
    {
      field: "currency",
      headerName: "Currency",
      filter: true,
      floatingFilter: true,
    },
    {
      field: "expenseStatus",
      headerName: "Status",
      cellClass: (params) => `status-${params.value.toLowerCase()}`,
    },
   
    {
      field: "expenses.length",
      headerName: "Total Expenses",
      filter: true,
      floatingFilter: true,
    },
    {
      field: "rejectionDescription",
      headerName: "Rejection Description",
      filter: true,
      floatingFilter: true,
    },
  ];

  return (
    <div>
      <Navbar
        userRole={jwtDecode(localStorage.getItem("token"))[TOKENROLEPATH]}
      />
      <div className="expense-list">
        <h2>Expense Forms List</h2>

        {filteredExpenses.length === 0 ? (
          <p>No expenses found.</p>
        ) : (
          <div
            className="ag-theme-quartz"
            style={{ height: 500, width: "100%" }}
          >
            <AgGridReact
              rowData={filteredExpenses}
              columnDefs={colDefs}
              onRowClicked={(event) => handleEdit(event.data.id)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default () => (
  <ProtectedRoute
    allowedRoles={[USERROLE[0], USERROLE[1], USERROLE[2], USERROLE[3]]}
  >
    <ExpenseList />
  </ProtectedRoute>
);
