import Login from "./components/login/Login";
import { Route, Routes } from 'react-router-dom'; // Import Routes and Route for routing
import EmployeeDashboard from "./components/employee/EmployeeDashboard";
import ManagerDashboard from "./components/manager/ManagerDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import AccountantDashboard from "./components/accountant/AccountantDashboard";
  function App() {
    return (
      <div className="App">
     <Routes>
                <Route path="/" element = {<Login/>}/>
                <Route path="/login" element={<Login />} />
                <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
                <Route path="/manager-dashboard" element={<ManagerDashboard />} />
                <Route path="/admin-dashboard" element={<AdminDashboard/>} />
                <Route path="/accountant-dashboard" element={ <AccountantDashboard/>} />
                
      </Routes>
      </div>
    );
  }

  export default App;
