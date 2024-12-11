import React, { useContext, useEffect, useState } from "react";
import MyContext from "../../../Context/MyContext";
import {
  BoldIcon,
  ItalicIcon,
  ListTodoIcon,
  Printer,
  Redo2,
  RemoveFormattingIcon,
  SpellCheck,
  Underline,
  Undo2,
} from "lucide-react";
import FontFamily from "./FontFamily";
import Heading from "./Heading";

const ToolbarButton = ({ label, Icon, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`relative text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 group ${
        isActive ? "bg-neutral-200/80" : ""
      }`}
    >
      <Icon className={`size-4`} />
    </button>
  );
};

const Toolbar = () => {
  const { editor } = useContext(MyContext);
  const [activeMarks, setActiveMarks] = useState({
    bold: false,
    italic: false,
    underline: false,
    taskList: false,
  });

  useEffect(() => {
    if (!editor) return;

    const updateActiveMarks = () => {
      setActiveMarks({
        bold: editor.isActive("bold"),
        italic: editor.isActive("italic"),
        underline: editor.isActive("underline"),
        taskList: editor.isActive("taskList"),
      });
    };

    // Initial check
    updateActiveMarks();

    // Subscribe to selection changes
    editor.on("selectionUpdate", updateActiveMarks);
    editor.on("transaction", updateActiveMarks);

    return () => {
      editor.off("selectionUpdate", updateActiveMarks);
      editor.off("transaction", updateActiveMarks);
    };
  }, [editor]);

  const Icons1 = [
    {
      label: "Undo",
      Icon: Undo2,
      onClick: () => editor?.chain().focus().undo().run(),
    },
    {
      label: "Redo",
      Icon: Redo2,
      onClick: () => editor?.chain().focus().redo().run(),
    },
    {
      label: "Print",
      Icon: Printer,
      onClick: () => window.print(),
    },
    {
      label: "Spell",
      Icon: SpellCheck,
      onClick: () => console.log("Grammar Check"),
    },
  ];

  const Icons2 = [
    {
      label: "Bold",
      Icon: BoldIcon,
      isActive: activeMarks.bold,
      onClick: () => editor?.chain().focus().toggleBold().run(),
    },
    {
      label: "Italic",
      Icon: ItalicIcon,
      isActive: activeMarks.italic,
      onClick: () => editor?.chain().focus().toggleItalic().run(),
    },
    {
      label: "Underline",
      Icon: Underline,
      isActive: activeMarks.underline,
      onClick: () => editor?.chain().focus().toggleUnderline().run(),
    },
    {
      label: "Tasklist",
      Icon: ListTodoIcon,
      isActive: activeMarks.taskList,
      onClick: () => editor?.chain().focus().toggleTaskList().run(),
    },
    {
      label: "Remove Formatting",
      Icon: RemoveFormattingIcon,
      onClick: () => editor?.chain().focus().unsetAllMarks().run(),
    },
  ];

  return (
    <div className="bg-[#f1f4f9] min-h-[40px] px-5 py-0.5 rounded-[24px] flex items-center gap-1">
      {Icons1.map((icons) => (
        <ToolbarButton key={icons.label} {...icons} />
      ))}

      {/* SEPARATOR */}
      <div className="h-6 w-[1px] bg-neutral-300" />
      <FontFamily />

      {/* SEPARATOR */}

      <div className="h-6 w-[1px] bg-neutral-300" />
      <Heading />

      {/* SEPARATOR */}

      <div className="h-6 w-[1px] bg-neutral-300" />

      {Icons2.map((icons) => (
        <ToolbarButton key={icons.label} {...icons} />
      ))}
    </div>
  );
};

export default Toolbar;
