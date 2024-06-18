import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthStatus } from "../store/actions/authAction.js";
import styled from '@emotion/styled'
import Container from '../styles/Container.jsx'
import inputBase from '@mui/material/InputBase'


const Form = styled.form`
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  
  border: solid 2px white;
  border-radius: 10px;
  gap: 20px;
  padding: 20px;
`;
const Button = styled.button`
    :hover{
      background-color: #333;
    }
`;
const Input = styled(inputBase)`
color:#f9f9f9;
  background-color: #1a1a1a;
  margin-left: 10px;
  width: 95%;
`;
const LoginPage = () => {


  const dispatcher = useDispatch();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/login",
        { login, password },
        { withCredentials: true },
      );
      dispatcher(setAuthStatus(true));
      navigate("/clients");
    } catch (error) {
      setError("Invalid login or password");
    }
  };

  return (
    <Container>

      <Form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <label>
          Login:
          <Input

              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
          />
        </label>
        <label>
          Password:
          <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
          />
        </label>
        <Button type="submit">Login</Button>
      </Form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </Container>
  );
};

export default LoginPage;
