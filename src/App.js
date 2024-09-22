import Login from "./screens/login/Login";
import { Route, Routes } from 'react-router-dom'; // Import Routes and Route for routing
import EmployeeDashboard from "./screens/employee/EmployeeDashboard";
import ManagerDashboard from "./screens/manager/ManagerDashboard";
import AdminDashboard from "./screens/admin/AdminDashboard";
import AccountantDashboard from "./screens/accountant/AccountantDashboard";
import ExpenseForm from "./screens/employee/ExpenseForm";
import NotFound from "./screens/common/NotFound"
import ExpenseList from "./components/ExpenseList";
import EditExpense from "./components/EditExpense";
  function App() {
    return (
      <div className="App">
     <Routes>
                <Route path="/" element = {<Login/>}/>
                <Route path="/login" element={<Login />} />
                <Route path="/Employee" element={<EmployeeDashboard />} />
                <Route path="/Manager" element={<ManagerDashboard />} />
                <Route path="/Admin" element={<AdminDashboard/>} />
                <Route path="/Accountant" element={ <AccountantDashboard/>} />
                <Route path="/MyExpenses" element={ <ExpenseList/>} />
                <Route path="/AddExpense" element={ <ExpenseForm/>} />
                <Route path="/EditExpense/:id" element={<EditExpense />} />

                <Route path="*" element={<NotFound />} />

                
      </Routes>
      </div>
    );
  }

  export default App;
