import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage.jsx";
import Page from "./components/Document/Page.jsx";
import { useContext, useEffect, useState } from "react";
import MyContext from "./Context/MyContext.jsx";
import AuthForm from "./components/AuthForm.jsx";
import axios from "axios";
import { Loader } from "lucide-react";
import ThreadedEditor from "./ThreadEditor.jsx";
import Chat from "./ThreadEditor.jsx";
import TextEditor from "./ThreadEditor.jsx";

function App() {
  const { endPoint, token } = useContext(MyContext);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserDetails = async (loginToken) => {
    try {
      const response = await axios.get(`${endPoint}/api/auth/getUser`, {
        headers: {
          Authorization: `Bearer ${loginToken}`,
        },
      });

      if (response?.data) {
        console.log("Token Verified");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      localStorage.removeItem("docsToken");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("currentProfile");
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
    return (
      <div className="max-w-screen-xl mx-auto px-16 py-6 h-[100vh] flex items-center justify-center gap-3">
        <Loader className="size-8 text-neutral-700 animate-spin" />
        <span className="text-neutral-700 font-medium">Loading...</span>
      </div>
    );
  }

  return (
    <Router>
      <div className="w-full max-w-screen-2xl mx-auto font-inter">
        {/* <TextEditor /> */}
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
