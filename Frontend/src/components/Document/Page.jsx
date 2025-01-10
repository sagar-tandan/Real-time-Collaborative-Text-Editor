import React, { useContext, useState, useEffect } from "react";
import Editor from "./Editor/Editor";
import Toolbar from "./Toolbar/Toolbar";
import Navbar from "./Navbar";
import MyContext from "@/Context/MyContext";
import { useParams } from "react-router-dom";
import { TiptapCollabProvider } from "@hocuspocus/provider";
import * as Y from "yjs";
import { LoaderIcon } from "lucide-react";
import socket from "@/Socket/Socket";

const Page = () => {
  const { canEditDocs, user } = useContext(MyContext);
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

  // State to track loading status
  const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   if (canEditDocs) {
  //     socket.emit("new_user", { room, user });
  //   }
  // });

  // useEffect(() => {
  //   console.log(ydoc);
  //   const handleDocumentLoad = () => {
  //     // Stop loading
  //     setIsLoading(false);
  //     console.log("Document loaded through event!");
  //   };

  //   ydoc.on("update", handleDocumentLoad); // Listen for updates

  //   // Cleanup
  //   return () => {
  //     ydoc.off("update", handleDocumentLoad); // Remove event listener
  //   };
  // }, [ydoc]);

  useEffect(() => {
    // console.log("mount");

    return () => {
      // console.log("unmount");

      if (canEditDocs) {
        socket.emit("editorClosed", { room, user });
      }
    };
  }, [canEditDocs]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [ydoc]);

  return (
    <div className="min-h-screen bg-white">
      {isLoading ? (
        <div className="w-full h-[100vh] flex items-center justify-center gap-x-3">
          <LoaderIcon className="animate-spin" />
          <span>Loading....</span>
        </div>
      ) : (
        <>
          <div className="flex flex-col px-4 pt-2 gap-y-2 fixed top-0 left-0 right-0 z-10 bg-[#fafbfd] print:hidden">
            <Navbar room={room} />
            {canEditDocs && <Toolbar />}
          </div>
          <div
            className={`${canEditDocs ? "pt-[114px]" : "pt-[80px]"} print:pt-0`}
          >
            <Editor provider={provider} ydoc={ydoc} room={room} />
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
