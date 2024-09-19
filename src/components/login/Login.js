import React, { useState } from "react";
import { login } from "../../services/AuthService"; // Adjust path as needed
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import "./Login.css";
import { jwtDecode } from "jwt-decode"; // import dependency
import { JWTROLE } from "../../config/Constants";

const Login = () => {
    localStorage.clear();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") setUsername(value);
    if (name === "password") setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await login(username, password);

      if (data.isSuccess) {

        localStorage.setItem("token", data.result.token);
        localStorage.setItem("refreshToken", data.result.refreshToken);
        localStorage.setItem("expiresAt", data.result.expiresAt);

        const decodedToken = jwtDecode(data.result.token);
        const role = decodedToken[JWTROLE]
        switch (role) {
            case "Employee":
                navigate("/employee-dashboard");
                break;
            case "Manager":
                navigate("/manager-dashboard");
                break;
            case "Admin":
                navigate("/admin-dashboard");
                break;
            case "Accountant":
                navigate("/accountant-dashboard");
                break;
            default:
                break;
        }
        console.log(role);
      } else {
        alert("Email or Password incorrect");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={handleChange}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
