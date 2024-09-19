import Login from "./components/login/Login";
import { Route, Routes } from 'react-router-dom'; // Import Routes and Route for routing
import Dashboard from "./components/dashboard/Dashboard";
  function App() {
    return (
      <div className="App">
     <Routes>
                <Route path="/" element = {<Login/>}/>
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                
      </Routes>
      </div>
    );
  }

  export default App;
