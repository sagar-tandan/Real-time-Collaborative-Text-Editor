import MyContext from "@/Context/MyContext";
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
} from "lucide-react";
import React, { useContext, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

const TextAlignButton = () => {
  const { editor } = useContext(MyContext);

  const alignButton = [
    {
      label: "Align Left",
      value: "left",
      icon: AlignLeftIcon,
    },
    {
      label: "Align Right",
      value: "right",
      icon: AlignRightIcon,
    },
    {
      label: "Align Center",
      value: "center",
      icon: AlignCenterIcon,
    },
    {
      label: "Align Justify",
      value: "justify",
      icon: AlignJustifyIcon,
    },
  ];
  return (
    <DropdownMenu className="z-10">
      <DropdownMenuTrigger>
        <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 text-sm px-2 overflow-hidden">
          <AlignLeftIcon className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-2 z-10 flex flex-col items-start gap-1.5 bg-white rounded-sm shadow-[#c1c1c1] shadow-sm">
        {alignButton.map(({ label, value, icon: Icon }) => (
          <button
            onClick={() => {
              editor.chain().focus().setTextAlign(value).run();
            }}
            className={`py-1 px-3 w-full flex hover:bg-neutral-200/80 cursor-pointer items-center ${
              editor?.isActive({ textAlign: value }) && "bg-neutral-200/80"
            }`}
          >
            <Icon className="size-4" />
            <span>{label}</span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TextAlignButton;
