import React, { useContext } from "react";
import DocumentInput from "./DocumentInput";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Link } from "react-router-dom";
import {
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
} from "@radix-ui/react-menubar";
import {
  AlignLeftIcon,
  BoldIcon,
  FileIcon,
  FileJsonIcon,
  FilePenIcon,
  FilePlusIcon,
  FilesIcon,
  FileTextIcon,
  GlobeIcon,
  ItalicIcon,
  PrinterIcon,
  Redo2Icon,
  RemoveFormattingIcon,
  StrikethroughIcon,
  TrashIcon,
  UnderlineIcon,
  Undo2Icon,
} from "lucide-react";
import logo from "/logo.svg";
import MyContext from "@/Context/MyContext";

const Navbar = () => {
  const { editor } = useContext(MyContext);

  const onDownload = (blob, fileName) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
  };

  const onSaveJSON = () => {
    if (!editor) return;
    const content = editor.getJSON();
    const blob = new Blob([JSON.stringify(content)], {
      type: "application/json",
    });
    onDownload(blob, "document.json");
  };

  return (
    <nav className="flex items-center">
      <div className="flex gap-2 items-center">
        <Link to="/">
          <img src={logo} alt="logo" width={36} height={36} />
        </Link>
      </div>
      <div className="flex flex-col">
        <DocumentInput />
        <div className="flex">
          <Menubar className="border-none bg-transparent shadow-none h-auto p-0">
            <MenubarMenu>
              <MenubarTrigger className=" text-sm px-[7px] py-0.5 font-normal rounded-sm hover:bg-neutral-200/80 h-auto cursor-pointer">
                File
              </MenubarTrigger>
              <MenubarContent className="print:hidden">
                <MenubarSub>
                  <MenubarSubTrigger className="flex items-center cursor-pointer px-2 py-[2px] outline-none border-none hover:bg-[#f1f4f9]">
                    <FilesIcon className="size-4 mr-2" />
                    Save
                  </MenubarSubTrigger>
                  <MenubarSubContent className="bg-white px-2 min-w-[150px] border-[#c1c1c1] border-[1px] rounded-sm">
                    <MenubarItem
                      onClick={() => {
                        onSaveJSON();
                      }}
                      className="hover:bg-[#fafbfd] cursor-pointer"
                    >
                      <FileJsonIcon className="size-4 mr-2" />
                      JSON
                    </MenubarItem>
                    <MenubarItem className="hover:bg-[#fafbfd] cursor-pointer">
                      <GlobeIcon className="size-4 mr-2" />
                      HTML
                    </MenubarItem>
                    <MenubarItem className="hover:bg-[#fafbfd] cursor-pointer">
                      <FileIcon className="size-4 mr-2" />
                      PDF
                    </MenubarItem>
                    <MenubarItem className="hover:bg-[#fafbfd] cursor-pointer">
                      <FileTextIcon className="size-4 mr-2" />
                      Text
                    </MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
                <MenubarItem>
                  <FilePlusIcon className="size-4 mr-2" />
                  New Document
                </MenubarItem>
                <MenubarItem>
                  <FilePenIcon className="size-4 mr-2" />
                  Rename
                </MenubarItem>
                <MenubarItem>
                  <TrashIcon className="size-4 mr-2" />
                  Remove
                </MenubarItem>
                <MenubarItem onClick={() => window.print()}>
                  <PrinterIcon className="size-4 mr-2" />
                  Print <MenubarShortcut> Ctrl+P</MenubarShortcut>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger className=" text-sm px-[7px] py-0.5 font-normal rounded-sm hover:bg-neutral-200/80 h-auto cursor-pointer">
                Edit
              </MenubarTrigger>
              <MenubarContent className="print:hidden">
                <MenubarItem>
                  <Undo2Icon className="size-4 mr-2" />
                  Undo
                </MenubarItem>
                <MenubarItem>
                  <Redo2Icon className="size-4 mr-2" />
                  Redo
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger className=" text-sm px-[7px] py-0.5 font-normal rounded-sm hover:bg-neutral-200/80 h-auto cursor-pointer">
                Insert
              </MenubarTrigger>
              <MenubarContent className="print:hidden">
                <MenubarSub>
                  <MenubarSubTrigger className="cursor-pointer px-2 py-[2px] outline-none border-none hover:bg-[#f1f4f9]">
                    Table
                  </MenubarSubTrigger>
                  <MenubarSubContent className="bg-white px-1 min-w-[150px] border-[#c1c1c1] border-[1px] rounded-sm">
                    <MenubarItem>1 X 1</MenubarItem>
                    <MenubarItem>2 X 2</MenubarItem>
                    <MenubarItem>3 X 3</MenubarItem>
                    <MenubarItem>4 X 4</MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger className=" text-sm px-[7px] py-0.5 font-normal rounded-sm hover:bg-neutral-200/80 h-auto cursor-pointer">
                Format
              </MenubarTrigger>
              <MenubarContent className="print:hidden">
                <MenubarSub>
                  <MenubarSubTrigger className="flex items-center cursor-pointer px-2 py-[2px] outline-none border-none hover:bg-[#f1f4f9]">
                    <AlignLeftIcon className="size-4 mr-2" />
                    Text
                  </MenubarSubTrigger>
                  <MenubarSubContent className="bg-white px-2 min-w-[150px] border-[#c1c1c1] border-[1px] rounded-sm">
                    <MenubarItem className="hover:bg-[#fafbfd] cursor-pointer">
                      <BoldIcon className="size-4 mr-2" />
                      Bold <MenubarShortcut> Ctrl+B</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem className="hover:bg-[#fafbfd] cursor-pointer">
                      <ItalicIcon className="size-4 mr-2" />
                      Italic <MenubarShortcut> Ctrl+I</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem className="hover:bg-[#fafbfd] cursor-pointer">
                      <UnderlineIcon className="size-4 mr-2" />
                      Underline <MenubarShortcut> Ctrl+U</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem className="hover:bg-[#fafbfd] cursor-pointer">
                      <StrikethroughIcon className="size-4 mr-2" />
                      Strikethrough&nbsp;&nbsp;
                      <MenubarShortcut> Ctrl+S</MenubarShortcut>
                    </MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
                <MenubarItem>
                  <RemoveFormattingIcon className="size-4 mr-2" />
                  Clear Formatting
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
