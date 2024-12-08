import React, { createContext, useState } from "react";

// 1. Create the context
const MyContext = createContext();

// 2. Create a provider component
export const MyProvider = ({ children }) => {
  const [endPoint, setEndPoint] = useState("http://localhost:8000");
  const [user, setUser] = useState(localStorage.getItem("token"));
  const [editor, setEditor] = useState(null); // Manage the editor state

  return (
    <MyContext.Provider
      value={{ endPoint, setEndPoint, user, setUser, editor, setEditor }}
    >
      {children}
    </MyContext.Provider>
  );
};

export default MyContext;
