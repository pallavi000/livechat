import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Home from "./components/Home";
import axios from "axios";
import Chat from "./components/chat/Chat";
import { UserProvider } from "./context/Context";
import UserProtected from "./protected/UserProtected";

axios.defaults.baseURL = "http://localhost:5000/api";

function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/" element={<UserProtected />}>
            <Route exact path="/" element={<Chat />} />
          </Route>
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
