import React, { useContext, useState, useEffect } from "react";
import Editor from "./Editor/Editor";
import Toolbar from "./Toolbar/Toolbar";
import Navbar from "./Navbar";
import MyContext from "@/Context/MyContext";
import { useParams } from "react-router-dom";
import { TiptapCollabProvider } from "@hocuspocus/provider";
import * as Y from "yjs";
import { Loader2Icon, LoaderIcon } from "lucide-react";

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

  // State to track loading status
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleDocumentLoad = () => {
      // Stop loading
      console.log("Document loaded through event!");
      setIsLoading(false);
    };

    ydoc.on("update", handleDocumentLoad); // Listen for updates

    // Cleanup
    return () => {
      ydoc.off("update", handleDocumentLoad); // Remove event listener
    };
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
            {isLoading ? (
              // Display loading state while the document is loading
              <div className="flex justify-center items-center h-full">
                <p>Loading...</p>
              </div>
            ) : (
              // Render the editor once the document is loaded
              <Editor provider={provider} ydoc={ydoc} room={room} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
