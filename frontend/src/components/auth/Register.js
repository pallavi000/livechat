import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function register(e) {
    e.preventDefault();
    try {
      const data = {
        name,
        email,
        password,
      };
      const response = await axios.post("/user/register", data);
      console.log(response.data);
      navigate("/");
    } catch (error) {
      console.log(error.request.response);
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
        onSubmit={register}
      >
        <CardContent>
          <Typography
            variant="h5"
            sx={{ textAlign: "center", marginBottom: "1rem" }}
          >
            Sign Up
          </Typography>

          <Stack gap={"2rem"}>
            <TextField
              id="outlined-password-input"
              label="Full Name"
              type="text"
              required
              onChange={(e) => setName(e.target.value)}
            />
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
              Register
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Register;
