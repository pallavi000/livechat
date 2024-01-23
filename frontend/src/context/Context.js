// UserContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//axios
import AxiosInstance from "../utils/AxiosInstance";

//component
import Loader from "../components/Loader";

// Step 1: Create a context
const UserContext = createContext();

// Step 2: Create a context provider
export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [isAppReady, setIsAppReady] = useState(false);

  const navigate = useNavigate();

  async function getCurrentUser() {
    try {
      const response = await AxiosInstance.get("/user/current");
      setCurrentUser(response.data);
      setIsAppReady(true);
    } catch (error) {
      userLogout();
    }
  }

  function userLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getCurrentUser();
    } else {
      setIsAppReady(true);
    }
  }, []);

  // Provide the current user and login/logout functions to the context
  const contextValue = {
    currentUser,
    userLogout,
  };

  if (!isAppReady) return <Loader />;
  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

// Step 3: Use the context in components
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
