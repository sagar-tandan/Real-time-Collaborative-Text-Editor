import React from "react";
import Header from "../Header/Header";
import { Link } from "react-router-dom";
import Templategallery from "../Template/Templategallery";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-10 bg-white h-16 p-4">
        <Header />
      </div>
      <div className="mt-16">
        {/* Click
        <Link to="/document/1234">
          <span className="text-blue-500"> here </span>
        </Link>
        to go to document id */}
        <Templategallery />
      </div>
    </div>
  );
};

export default HomePage;
