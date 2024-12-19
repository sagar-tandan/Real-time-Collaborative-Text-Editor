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
  const { user, setUser, endPoint, token } = useContext(MyContext);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserDetails = async (loginToken) => {
    try {
      const response = await axios.get(`${endPoint}/api/auth/getUser`, {
        headers: {
          Authorization: `Bearer ${loginToken}`,
        },
      });

      if (response?.data) {
        // setUser(response.data);
        // localStorage.setItem("userData", JSON.stringify(response.data));
        console.log("Token Verified");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      localStorage.removeItem("docsToken");
      localStorage.removeItem("userInfo");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      const loginToken = localStorage.getItem("docsToken");
      if (loginToken) {
        await fetchUserDetails(loginToken);
      } else {
        setIsLoading(false);
      }
    };
    verifyToken();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Or a proper loading component
  }

  return (
    <Router>
      <div className="w-full max-w-screen-2xl mx-auto font-inter">
        <Routes>
          <Route
            path="/"
            element={token ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route path="/document/:id" element={<Page />} />
          <Route
            path="/login"
            element={token ? <Navigate to="/" /> : <AuthForm />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
