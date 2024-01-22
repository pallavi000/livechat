// UserContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import AxiosInstance from "../utils/AxiosInstance";

// Step 1: Create a context
const UserContext = createContext();

// Step 2: Create a context provider
export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();

  async function getCurrentUser() {
    const response = await AxiosInstance.get("/user/current");
    console.log(response.data);
    setCurrentUser(response.data);
  }

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    console.log(currentUser, "currentUser");
  }, []);

  // Provide the current user and login/logout functions to the context
  const contextValue = {
    currentUser,
  };

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
