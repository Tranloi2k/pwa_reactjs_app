// src/Login.js
import React, { useState } from "react";
import axiosInstance from "../../config/axios";
import GoogleLoginButton from "./GoogleLoginButton";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response: { accessToken: string; refreshToken: string } =
        await axiosInstance.post("/login", {
          email,
          password,
        });
      console.log(response);
      localStorage.setItem("access_token", response.accessToken);
      localStorage.setItem("refresh_token", response.refreshToken);
      setMessage("Login successful!");
    } catch (error) {
      setMessage("Login failed: " + error);
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <GoogleLoginButton />
      <p>{message}</p>
    </div>
  );
};

export default Login;
