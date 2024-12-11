import React, { useContext, useEffect, useRef, useState } from "react";
import MyContext from "../../../Context/MyContext";
import { ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const HeadingTool = () => {
  const { editor } = useContext(MyContext);

  const Heading = [
    { label: "Normal Text", value: 0, fontSize: "16px" },
    { label: "Heading 1", value: 1, fontSize: "32px" },
    { label: "Heading 2", value: 2, fontSize: "24px" },
    { label: "Heading 3", value: 3, fontSize: "20px" },
    { label: "Heading  4", value: 4, fontSize: "18px" },
    { label: "Heading  5", value: 5, fontSize: "16px" },
  ];

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
      <DropdownMenu>
        <DropdownMenuTrigger>
          <button className=" w-[120px] h-7 flex items-center justify-between rounded-sm hover:bg-neutral-200/80 px-2 overflow-hidden text-sm">
            <span className="truncate">{getCurrentHeading()}</span>
            <ChevronDown className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className=" flex flex-col gap-y-1">
          {Heading.map(({ label, value, fontSize }) => (
            <button
              onClick={() => {
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
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default HeadingTool;
