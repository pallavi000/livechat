import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Home from "./components/Home";
import axios from "axios";
import Chat from "./components/chat/Chat";

axios.defaults.baseURL = "http://localhost:5000/api";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Chat />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
