import { CloudUploadIcon } from "lucide-react";
import React from "react";

const DocumentInput = () => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-lg px-2.5 cursor-pointer truncate">
        Untitled document
      </span>
      <CloudUploadIcon className="size-5" />
    </div>
  );
};

export default DocumentInput;
