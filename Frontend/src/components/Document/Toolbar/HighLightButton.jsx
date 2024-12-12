import MyContext from "@/Context/MyContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { HighlighterIcon } from "lucide-react";
import React, { useContext, useState, useEffect } from "react";
import { SketchPicker } from "react-color";

const HighLightButton = () => {
  const { editor } = useContext(MyContext);
  const initialColor = editor?.getAttributes("textStyle").color || "#FFFFFF";
  const [color, setColor] = useState(initialColor);

  useEffect(() => {
    // Update the color if the editor's textStyle color changes
    setColor(editor?.isActive("highlight") || "#FFFFFF");
  }, [editor]);

  const handleColorChange = (newColor) => {
    setColor(newColor.hex); // Update the local state to reflect the new color
    editor?.chain().focus().toggleHighlight({ color: newColor.hex }).run(); // Apply the color to the editor
  };

  return (
    <DropdownMenu className="z-10">
      <DropdownMenuTrigger>
        <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 text-sm px-2 overflow-hidden">
          <HighlighterIcon className="size-4" />
          <div
            className="h-1 w-[20px]"
            style={{ backgroundColor: color }}
          ></div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2.5 z-10">
        <SketchPicker
          color={color} // Use the local state color
          onChange={handleColorChange} // Handle color changes
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HighLightButton;
