import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";

//components
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Chat from "./components/chat/Chat";
import { UserProvider } from "./context/Context";
import UserProtected from "./protected/UserProtected";
import AppLayout from "./components/layouts/AppLayout";

axios.defaults.baseURL = "http://localhost:5000/api";

function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
          <Route element={<AppLayout />}>
            <Route exact path="/" element={<UserProtected />}>
              <Route exact path="/" element={<Chat />} />
            </Route>
          </Route>
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
