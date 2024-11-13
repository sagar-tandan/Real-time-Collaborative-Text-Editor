import { useContext, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AuthForm from "./components/AuthForm.jsx";
import Header from "./components/Header/Header.jsx";
import HomePage from "./components/HomePage/HomePage.jsx";
import MyContext from "./Context/MyContext.jsx";

function App() {
  const { user, setUser } = useContext(MyContext);

  useState(() => {
    if (localStorage.getItem("token")) {
      setUser(localStorage.getItem("token"));
    }
  }, []);

  return (
    <Router>
      <div className="w-full max-w-screen-2xl mx-auto font-inter">
        {/* navigation bar or header here */}
        <Header />

        <Routes>
          <Route
            path="/home"
            element={user ? <HomePage /> : <Navigate to="/" />}
          />
          <Route
            path="/"
            element={user ? <Navigate to="/home" /> : <AuthForm />}
          />

          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
