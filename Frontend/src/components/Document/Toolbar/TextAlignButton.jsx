import MyContext from "@/Context/MyContext";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Link,
} from "lucide-react";
import React, { useContext, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

const TextAlignButton = () => {
  const { editor } = useContext(MyContext);
  return (
    <DropdownMenu className="z-10">
      <DropdownMenuTrigger>
        <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 text-sm px-2 overflow-hidden">
          <AlignLeft className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-2 z-10 flex flex-col items-start gap-2 bg-white rounded-sm shadow-[#c1c1c1] shadow-sm">
        <DropdownMenuItem
          onClick={() => {
            editor.chain().focus().setTextAlign("left").run();
          }}
          className={`py-1 px-3 w-full flex gap-x-2 hover:bg-neutral-200/80 cursor-pointer items-center ${
            editor?.isActive({ textAlign: "left" }) && "bg-neutral-200/80"
          }`}
        >
          <AlignLeft className="size-4" />
          <span>Align left</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            editor.chain().focus().setTextAlign("center").run();
          }}
          className={`py-1 px-3 w-full flex gap-x-2 hover:bg-neutral-200/80 cursor-pointer items-center ${
            editor?.isActive({ textAlign: "center" }) && "bg-neutral-200/80"
          }`}
        >
          <AlignCenter className="size-4" />
          <span>Align center</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            editor.chain().focus().setTextAlign("right").run();
          }}
          className={`py-1 px-3 w-full flex gap-x-2 hover:bg-neutral-200/80 cursor-pointer items-center ${
            editor?.isActive({ textAlign: "right" }) && "bg-neutral-200/80"
          }`}
        >
          <AlignRight className="size-4" />
          <span>Align right</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            editor.chain().focus().setTextAlign("justify").run();
          }}
          className={`py-1 px-3 w-full flex gap-x-2 hover:bg-neutral-200/80 cursor-pointer items-center ${
            editor?.isActive({ textAlign: "justify" }) && "bg-neutral-200/80"
          }`}
        >
          <AlignJustify className="size-4" />
          <span>Align Jusify</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TextAlignButton;
