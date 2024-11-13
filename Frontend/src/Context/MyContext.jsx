import React, { createContext, useState } from "react";

// 1. Create the context
const MyContext = createContext();

// 2. Create a provider component
export const MyProvider = ({ children }) => {
  const [endPoint, setEndPoint] = useState("http://localhost:8000");

  return (
    <MyContext.Provider value={{ endPoint, setEndPoint }}>
      {children}
    </MyContext.Provider>
  );
};

export default MyContext;
