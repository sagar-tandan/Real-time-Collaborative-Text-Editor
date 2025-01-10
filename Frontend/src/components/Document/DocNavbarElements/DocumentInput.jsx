import MyContext from "@/Context/MyContext";
import { useToast } from "@/hooks/use-toast";
import socket from "@/Socket/Socket";
import axios from "axios";
import { CloudUploadIcon } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";

const DocumentInput = ({ room }) => {
  const {
    documentName,
    setDocumentName,
    endPoint,
    user,
    token,
    setUpdateTrigger,
    updateTrigger,
  } = useContext(MyContext);

  const { toast } = useToast();

  const handleOnChange = (e) => {
    const value = e.target.value;
    setDocumentName(value);
  };

  const updateDocumentName = async () => {
    try {
      const response = await axios.post(
        `${endPoint}/api/document/updateDocument`,
        {
          docId: room,
          documentName: documentName,
          userId: user.userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setUpdateTrigger((prev) => !prev);
        socket.emit("rename", { room, documentName }); //For realtime update in other side
        toast({
          description: "Document renamed successfully",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: error.response.data.message,
      });
    }
  };

  useEffect(() => {
    socket.on("updated-docName", (data) => {
      setDocumentName(data);
    });
  }, [updateTrigger]);

  const handleBlur = () => {
    // Update the document name when input loses focus
    updateDocumentName(documentName);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // Update the document name when Enter key is pressed
      updateDocumentName(documentName);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        className="text-lg px-1.5 truncate w-[180px] outline-blue-500 border-[1px] border-white rounded-sm hover:border-[#c1c1c1]"
        type="text"
        value={documentName}
        onChange={handleOnChange}
        onBlur={handleBlur} // Trigger onBlur when input loses focus
        onKeyDown={handleKeyDown} // Trigger on Enter key press
      />
      <CloudUploadIcon className="size-5" />
    </div>
  );
};

export default DocumentInput;
