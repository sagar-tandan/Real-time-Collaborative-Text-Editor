import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage.jsx";
import Page from "./components/Document/Page.jsx";
import { io } from "socket.io-client";
import { useContext, useEffect, useState } from "react";
import MyContext from "./Context/MyContext.jsx";
import AuthForm from "./components/AuthForm.jsx";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

function App() {
  const { user, setUser, endPoint } = useContext(MyContext);

  const fetchUserDetails = async (loginToken) => {
    try {
      const response = await axios.get(`${endPoint}/api/auth/getUser`, {
        headers: {
          Authorization: `Bearer ${loginToken}`, // Add the token to the Authorization header
        },
      });

      if (response && response.status === 200) {
        setUser(response.data);
      } else {
        localStorage.removeItem("docsToken");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      localStorage.removeItem("docsToken");
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      const loginToken = localStorage.getItem("docsToken");
      if (loginToken) {
        await fetchUserDetails(loginToken);
      }
    };
    verifyToken();
  }, []);

  return (
    <Router>
      <div className="w-full max-w-screen-2xl mx-auto font-inter">
        {/* navigation bar or header here */}
        {/* <Header /> */}
        <Routes>
          <Route
            path="/"
            element={user ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route path="/document/:id" element={<Page />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <AuthForm />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
