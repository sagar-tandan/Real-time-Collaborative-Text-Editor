import MyContext from "@/Context/MyContext";
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  ListIcon,
  ListOrderedIcon,
} from "lucide-react";
import React, { useContext } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

const ListButton = () => {
  const { editor } = useContext(MyContext);
  const listItem = [
    {
      label: "Bullet List",
      icon: ListIcon,
      onClick: () => editor?.chain().focus().toggleBulletList().run(),
      isActive: editor?.isActive("BulletList"),
    },
    {
      label: "Ordered List",
      icon: ListOrderedIcon,
      onClick: () => editor?.chain().focus().toggleOrderedList().run(),
      isActive: editor?.isActive("orderedList"),
    },
  ];
  return (
    <DropdownMenu className="z-10">
      <DropdownMenuTrigger>
        <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 text-sm px-2 overflow-hidden">
          <ListIcon className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-2 z-10 flex flex-col items-start gap-1.5 bg-white rounded-sm shadow-[#c1c1c1] shadow-sm">
        {listItem.map(({ label, isActive, onClick, icon: Icon }) => (
          <button
            onClick={onClick}
            className={`py-1 px-3 gap-x-2 w-full flex hover:bg-neutral-200/80 cursor-pointer items-center ${
              isActive && "bg-neutral-200/80"
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

export default ListButton;
