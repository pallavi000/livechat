import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login(e) {
    console.log(email, password);
    e.preventDefault();
    try {
      const data = {
        email,
        password,
      };
      const response = await axios.post("/user/login", data);
      console.log(response.data, "user dataaaaaaaaaaaaaa");
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      toast.success("Login successful!", {
        position: "top-right",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        height: "100vh",
        alignItems: "center",
      }}
    >
      <Card
        sx={{ minWidth: "40%", padding: "2rem" }}
        variant="outlined"
        component={"form"}
        onSubmit={login}
      >
        <ToastContainer />
        <CardContent>
          <Typography
            variant="h5"
            sx={{ textAlign: "center", marginBottom: "1rem" }}
          >
            Sign In
          </Typography>

          <Stack gap={"2rem"}>
            <TextField
              id="outlined-password-input"
              label="Email"
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              id="outlined-password-input"
              label="Password"
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" variant="contained">
              Submit
            </Button>

            <Box textAlign={"center"}>
              Don't have an account? <Link to={"/register"}>Sing Up</Link>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;
