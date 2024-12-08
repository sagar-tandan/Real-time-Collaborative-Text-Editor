import React from "react";
import Editor from "./Editor/Editor";
import Toolbar from "./Toolbar/Toolbar";

const Page = () => {
  return (
    <div className="min-h-screen bg-[#FAFBFD]">
      <Toolbar />
      <Editor />
    </div>
  );
};

export default Page;
