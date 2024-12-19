import React from "react";
import Header from "../Header/Header";
import Templategallery from "../Template/Templategallery";
import AuthForm from "../AuthForm";
import UserDocuments from "./UserDocuments";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-10 bg-white h-16 p-4">
        <Header />
      </div>
      <div className="mt-16">
        <Templategallery />
        <UserDocuments />
      </div>
    </div>
  );
};

export default HomePage;
