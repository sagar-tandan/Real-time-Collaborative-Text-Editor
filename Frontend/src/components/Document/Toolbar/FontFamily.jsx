import React, { useContext, useEffect, useRef, useState } from "react";
import MyContext from "../../../Context/MyContext";
import { ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const FontFamily = () => {
  const { editor } = useContext(MyContext);

  const fonts = [
    { label: "Arial", value: "Arial" },
    { label: "Times New Roman", value: "Times New Roman" },
    { label: "Georgia", value: "Georgia" },
    { label: "Verdana", value: "Verdana" },
    { label: "Impact", value: "Impact" },
    { label: "Courier", value: "Courier" },
    { label: "Roboto", value: "Roboto" },
    { label: "Poppins", value: "Poppins" },
    { label: "Muli", value: "Muli" },
  ];

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <button className="outline-none w-[120px] h-7 flex items-center justify-between rounded-sm hover:bg-neutral-200/80 px-2 overflow-hidden text-sm">
            <span className="truncate">
              {editor?.getAttributes("textStyle").fontFamily || "Arial"}
            </span>
            <ChevronDown className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className=" flex flex-col gap-y-1">
          {fonts.map(({ label, value }) => (
            <button
              onClick={() => {
                editor?.chain().focus().setFontFamily(value).run();
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
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default FontFamily;
