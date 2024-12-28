import MyContext from "@/Context/MyContext";
import { MinusIcon, PlusIcon } from "lucide-react";
import React, { useContext, useState } from "react";

const FontSizeButton = () => {
  const { editor } = useContext(MyContext);

  const currentFontSize = editor?.getAttributes("textStyle")?.fontSize
    ? editor.getAttributes("textStyle").fontSize.replace("px", "")
    : "16";

  const [fontSize, setFontSize] = useState(currentFontSize);
  const [inputValue, setInputValue] = useState(fontSize);
  const [isEditing, setIsEditing] = useState(false);

  const updateFontSize = (newSize) => {
    const size = parseInt(newSize, 10);
    if (!isNaN(size) && size > 0) {
      editor
        ?.chain()
        .focus()
        .setMark("textStyle", { fontSize: `${size}px` })
        .run();

      setFontSize(size.toString());
      setInputValue(size.toString());
      setIsEditing(false);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    updateFontSize(inputValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      updateFontSize(inputValue);
      editor?.commands.focus();
    }
  };

  const increaseFontSize = () => {
    const newFontSize = parseInt(currentFontSize) + 1;
    updateFontSize(newFontSize.toString());
  };

  const decreaseFontSize = () => {
    const newFontSize = parseInt(currentFontSize) - 1;
    if (newFontSize > 0) updateFontSize(newFontSize.toString());
  };

  return (
    <div className="flex gap-[8px] items-center justify-center">
      <button onClick={decreaseFontSize}>
        <MinusIcon className="size-4" />
      </button>

      {isEditing ? (
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          className="bg-transparent p-[2px] border-[#636363] border-[1px] rounded-sm w-[35px] text-center text-sm outline-blue-500"
        />
      ) : (
        <button
          onClick={() => {
            setIsEditing(true);
            setInputValue(fontSize);
          }}
          className="bg-transparent p-[2px] border-[#636363] border-[1px] rounded-sm w-[35px] text-center text-sm outline-blue-500"
        >
          {currentFontSize}
        </button>
      )}

      <button onClick={increaseFontSize}>
        <PlusIcon className="size-4" />
      </button>
    </div>
  );
};

export default FontSizeButton;
