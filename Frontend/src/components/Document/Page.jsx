import React, { useContext, useState } from "react";
import Editor from "./Editor/Editor";
import Toolbar from "./Toolbar/Toolbar";
import Navbar from "./Navbar";
import MyContext from "@/Context/MyContext";
import Room from "./Room";

const Page = () => {
  const { canEditDocs } = useContext(MyContext);
  return (
    <div className="min-h-screen bg-[#FAFBFD]">
      <div className="flex flex-col px-4 pt-2 gap-y-2 fixed top-0 left-0 right-0 z-10 bg-[#fafbfd] print:hidden">
        <Navbar />
        {canEditDocs && <Toolbar />}
      </div>
      <div className={`${canEditDocs ? "pt-[114px]" : "pt-[80px]"} print:pt-0`}>
        <Room>
          <Editor />
        </Room>
      </div>
    </div>
  );
};

export default Page;
