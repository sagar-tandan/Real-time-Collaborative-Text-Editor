import React, { useContext, useEffect, useRef, useState } from "react";
import MyContext from "../../../Context/MyContext";
import { ChevronDown } from "lucide-react";

const FontFamily = () => {
  const { editor } = useContext(MyContext);
  const [showDialog, setShowDialog] = useState(false);
  const dialogRef = useRef(null);

  const fonts = [
    { label: "Arial", value: "Arial" },
    { label: "Times New Roman", value: "Times New Roman" },
    { label: "Courier New", value: "Courier New" },
    { label: "Georgia", value: "Georgia" },
    { label: "Verdana", value: "Verdana" },
    { label: "Impact", value: "Impact" },
    { label: "Courier", value: "Courier" },
    { label: "Roboto", value: "Roboto" },
    { label: "Poppins", value: "Poppins" },
    { label: "Muli", value: "Muli" },
  
  ];

  useEffect(() => {
    // Close the dialog if a click is detected outside
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        setShowDialog(false);
      }
    };

    // Add the event listener when the component is mounted
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener when the component is unmounted
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="relative">
      <button
        onClick={() => {
          setShowDialog((prev) => !prev);
        }}
        className=" w-[120px] h-7 flex items-center justify-between rounded-sm hover:bg-neutral-200/80 px-2 overflow-hidden text-sm"
      >
        <span className="truncate">
          {editor?.getAttributes("textStyle").fontFamily || "Arial"}
        </span>
        <ChevronDown className="size-4" />
      </button>

      {showDialog && (
        <div
          ref={dialogRef}
          className="w-[160px] max-h-[400px] truncate overflow-y-scroll overflow-x-hidden absolute -left-1 top-8 flex flex-col bg-white border-[1px] border-[#c1c1c1] rounded-sm shadow-[#c1c1c1] shadow-md"
        >
          {fonts.map(({ label, value }) => (
            <button
              onClick={() => {
                editor?.chain().focus().setFontFamily(value).run();
                setShowDialog(false);
              }}
              key={value}
              className={`flex items-center px-2 py-1 hover:bg-neutral-200/80 ${
                editor?.getAttributes("textStyle").fontFamily == value &&
                "bg-neutral-200/80"
              }`}
              style={{ fontFamily: value }}
            >
              <span className="text-sm"> {label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FontFamily;
