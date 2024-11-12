import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/loginComps/Login.jsx";
import Register from "./components/Register.jsx";

function App() {

  return (
    <Router>
      <div className="w-full max-w-screen-2xl mx-auto">
        {/* navigation bar or header here */}

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
