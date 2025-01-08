import React, { useContext, useState } from "react";
import Editor from "./Editor/Editor";
import Toolbar from "./Toolbar/Toolbar";
import Navbar from "./Navbar";
import MyContext from "@/Context/MyContext";
import Room from "./Room";
import { useParams } from "react-router-dom";
import { TiptapCollabProvider } from "@hocuspocus/provider";
import * as Y from "yjs";

// const documentId = useParams();

// const appId = "7j9y6m10";
// const room = `${documentId.id}`;

// // ydoc and provider for Editor
// const ydoc = new Y.Doc();
// const provider = new TiptapCollabProvider({
//   appId,
//   name: room,
//   document: ydoc,
// });

const Page = () => {
  const { canEditDocs } = useContext(MyContext);

  const documentId = useParams();

  const appId = "7j9y6m10";
  const room = `${documentId.id}`;

  // ydoc and provider for Editor
  const ydoc = new Y.Doc();
  const provider = new TiptapCollabProvider({
    appId,
    name: room,
    document: ydoc,
  });

  return (
    <div className="min-h-screen bg-[#50596b]">
      <div className="flex flex-col px-4 pt-2 gap-y-4 fixed top-0 left-0 right-0 z-10 bg-[#fafbfd] print:hidden">
        <Navbar />
        {canEditDocs && <Toolbar />}
      </div>
      <div className={`${canEditDocs ? "pt-[114px]" : "pt-[80px]"} print:pt-0`}>
        {/* <Room docId={documentId?.id}> */}
        <Editor provider={provider} ydoc={ydoc} room={room} />
        {/* </Room> */}
      </div>
    </div>
  );
};

export default Page;
