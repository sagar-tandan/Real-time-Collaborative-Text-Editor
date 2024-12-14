import MyContext from "@/Context/MyContext";
import { MinusIcon, PlusIcon } from "lucide-react";
import React, { useContext, useState } from "react";

const FontSizeButton = () => {
  const { editor } = useContext(MyContext);
  const size = editor?.getAttributes("textStyle").fontSize;

  const [fontSize, setFontSize] = useState(16); // Initialize with a default value

  // Function to apply font size to the editor
  const applyFontSize = (size) => {
    if (editor) {
      editor
        .chain()
        .focus()
        .setTextStyle({ fontSize: `${size}px` })
        .run();
    }
  };

  // Handle increase font size
  const increaseFontSize = () => {
    const newFontSize = fontSize + 2; // Increase font size by 2px
    setFontSize(newFontSize);
    applyFontSize(newFontSize);
    console.log(fontSize)
  };

  // Handle decrease font size
  const decreaseFontSize = () => {
    const newFontSize = fontSize > 4 ? fontSize - 2 : 4; // Prevent font size from going below 4px
    setFontSize(newFontSize);
    applyFontSize(newFontSize);
  };

  return (
    <div className="flex gap-[6px] items-center justify-center">
      <button onClick={decreaseFontSize}>
        <MinusIcon className="size-4" />
      </button>

      <input
        value={fontSize}
        readOnly
        className="bg-transparent p-[2px] border-[#636363] border-[1px] rounded-sm w-[35px] text-center text-sm outline-blue-500"
      />

      <button onClick={increaseFontSize}>
        <PlusIcon className="size-4" />
      </button>
    </div>
  );
};

export default FontSizeButton;
