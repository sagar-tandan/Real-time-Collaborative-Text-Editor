import React, { useContext } from "react";
import MyContext from "../../../Context/MyContext";
import { Undo2 } from "lucide-react";

const ToolbarButton = ({ onClick, isActive, Icon }) => {
  return (
    <button
      onClick={onClick}
      className={`text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 ${
        isActive && "bg-neutral-200/80"
      } `}
    >
      <Icon className="size-4" />
    </button>
  );
};

const Toolbar = () => {
  const { editor } = useContext(MyContext);
  // console.log("Toolbar Editor : ", editor);

  const allIcons = [
    {
      label: "Undo",
      Icon: Undo2,
      onClick: () => editor?.chain().focus().undo().run(),
    },
  ];
  return (
    <div className="bg-[#f1f4f9] min-h-[40px] px-2.5 py-0.5 rounded-[24px] flex items-center gap-1">
      {allIcons.map((icons) => (
        <ToolbarButton key={icons.label} {...icons} />
      ))}
    </div>
  );
};

export default Toolbar;
