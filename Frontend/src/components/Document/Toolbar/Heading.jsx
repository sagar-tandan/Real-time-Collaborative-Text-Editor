import React, { useContext, useEffect, useRef, useState } from "react";
import MyContext from "../../../Context/MyContext";
import { ChevronDown } from "lucide-react";

const Heading = () => {
  const { editor } = useContext(MyContext);
  const [showDialog, setShowDialog] = useState(false);
  const dialogRef = useRef(null);

  const Heading = [
    { label: "Normal Text", value: 0, fontSize: "16px" },
    { label: "Heading 1", value: 1, fontSize: "32px" },
    { label: "Heading 2", value: 2, fontSize: "24px" },
    { label: "Heading 3", value: 3, fontSize: "20px" },
    { label: "Heading  4", value: 4, fontSize: "18px" },
    { label: "Heading  5", value: 5, fontSize: "16px" },
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

  const getCurrentHeading = () => {
    for (let level = 0; level <= 5; level++) {
      if (editor?.isActive("heading", { level })) {
        return `Heading ${level}`;
      }
    }
    return "Normal Text";
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          setShowDialog((prev) => !prev);
        }}
        className=" w-[120px] h-7 flex items-center justify-between rounded-sm hover:bg-neutral-200/80 px-2 overflow-hidden text-sm"
      >
        <span className="truncate">{getCurrentHeading()}</span>
        <ChevronDown className="size-4" />
      </button>

      {showDialog && (
        <div
          ref={dialogRef}
          className="z-10 w-[160px] max-h-[400px] truncate overflow-y-scroll overflow-x-hidden absolute -left-1 top-8 flex flex-col bg-white border-[1px] border-[#c1c1c1] rounded-sm shadow-[#c1c1c1] shadow-md"
        >
          {Heading.map(({ label, value, fontSize }) => (
            <button
              onClick={() => {
                setShowDialog(false);
                if (value === 0) {
                  editor?.chain().focus().setParagraph().run();
                } else {
                  editor?.chain().focus().toggleHeading({ level: value }).run();
                }
              }}
              key={value}
              className={`flex items-center px-2 py-1 hover:bg-neutral-200/80 ${
                value === 0 &&
                !editor?.isActive("heading") &&
                "bg-neutral-200/80"
              } ${
                editor?.isActive("heading", { level: value }) &&
                "bg-neutral-200/80"
              }`}
              style={{ fontSize }}
            >
              <span> {label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Heading;
