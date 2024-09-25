import React, { useState } from "react";
import { login } from "../../services/AuthService"; // Adjust path as needed
import { useNavigate } from "react-router-dom";
import "../../styles/Login.css";
import { jwtDecode } from "jwt-decode"; 
import { TOKENROLEPATH } from "../../config/Constants";
import CircularProgress from "@mui/material/CircularProgress"; // CircularProgress bileşenini ekleyin

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loading durumu
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") setUsername(value);
    if (name === "password") setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // İsteği başlatmadan önce loading durumunu true yap

    try {
      const data = await login(username, password);

      if (data.isSuccess) {
        localStorage.setItem("token", data.result.token);
        localStorage.setItem("refreshToken", data.result.refreshToken);
        localStorage.setItem("expiresAt", data.result.expiresAt);
        
        const decodedToken = jwtDecode(data.result.token);
        const role = decodedToken[TOKENROLEPATH].toLowerCase();
            
        if (role) {
          navigate(`/${role}`);
        }
      } else {
        setErrorMessage("Invalid Credentials");
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false); // İstek tamamlandığında loading durumunu false yap
    }
  };

  return (
    <div className="login-container">
      {loading ? ( // Eğer loading durumu true ise yükleme göstergesi göster
        <CircularProgress />
      ) : (
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login</h2>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <input
            placeholder="Email"
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={handleChange}
            required
          />
          <input
            placeholder="Password"
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleChange}
            required
          />
          <button className="login-form-button" type="submit">Login</button>
        </form>
      )}
    </div>
  );
};

export default Login;
