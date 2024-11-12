import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/loginComps/Login.jsx";
import AuthForm from "./components/AuthForm.jsx";
import Header from "./components/Header/Header.jsx";
import HomePage from "./components/HomePage/HomePage.jsx";

function App() {
  return (
    <Router>
      <div className="w-full max-w-screen-2xl mx-auto">
        {/* navigation bar or header here */}
        <Header />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<AuthForm />} />

          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
