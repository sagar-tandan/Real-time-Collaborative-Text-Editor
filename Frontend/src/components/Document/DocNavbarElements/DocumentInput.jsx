import { CloudUploadIcon } from "lucide-react";
import React, { useState } from "react";

const DocumentInput = () => {
  const [docName, setDocName] = useState("Untitled Document");

  const handleOnChange = (e) => {
    const value = e.target.value;
    setDocName(value);
  };


  
  return (
    <div className="flex items-center gap-2">
      <input
        className="text-lg px-1.5 truncate w-[180px] outline-blue-500 border-[1px] border-white rounded-sm  hover:border-[#c1c1c1]"
        type="text"
        value={docName}
        onChange={handleOnChange}
      />
      <CloudUploadIcon className="size-5" />
    </div>
  );
};

export default DocumentInput;
