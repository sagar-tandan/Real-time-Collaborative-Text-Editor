import MyContext from "@/Context/MyContext";
import { useToast } from "@/hooks/use-toast";
import socket from "@/Socket/Socket";
import axios from "axios";
import { TbCloudCheck } from "react-icons/tb";

import { MdLoop } from "react-icons/md";

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
    isSaving,
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
    <div className="flex items-center gap-2 w-fit">
      <input
        className="text-lg px-1.5 truncate w-[180px] outline-blue-500 border-[1px] border-white rounded-sm hover:border-[#c1c1c1]"
        type="text"
        value={documentName}
        onChange={handleOnChange}
        onBlur={handleBlur} // Trigger onBlur when input loses focus
        onKeyDown={handleKeyDown} // Trigger on Enter key press
      />

      {isSaving ? (
        <div className="flex gap-2 items-center justify-center">
          <MdLoop className="size-5 text-neutral-600" />
          <span className="text-[14px] text-neutral-600">Saving....</span>
        </div>
      ) : (
        <div className="flex gap-2 items-center justify-center">
          <TbCloudCheck className="size-5 text-neutral-600" />
          <span className="text-[14px] text-neutral-600">Saved</span>
        </div>
      )}
    </div>
  );
};

export default DocumentInput;
