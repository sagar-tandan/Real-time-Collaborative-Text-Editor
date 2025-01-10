import React, { useContext, useEffect, useState } from "react";
import DocumentInput from "./DocNavbarElements/DocumentInput";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
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
import UserProfile from "../Header/UserProfile";
import ShareDocument from "./DocNavbarElements/ShareDocument";
import socket from "@/Socket/Socket";
import CustomAvatar from "./Toolbar/Avatar";

const Navbar = ({ room }) => {
  const { editor, user, allowToAddCollaborator } = useContext(MyContext);
  const [activeUsers, setActiveUsers] = useState([]); // Use useState here

  useEffect(() => {
    // Listen for 'update_user' event and update the user state
    socket.on("update_user", (data) => {
      setActiveUsers((prevUsers) => {
        // Check if the user already exists in the activeUsers array
        const userExists = prevUsers.some(
          (user) => user.userId === data.userId
        );

        // Only add the user if they don't already exist
        if (!userExists) {
          return [...prevUsers, data];
        }
        return prevUsers;
      });
    });

    // Listen for 'editorClosed' event and remove the user from activeUsers
    socket.on("remove_user", (data) => {
      setActiveUsers((prevUsers) =>
        prevUsers.filter((user) => user.userId !== data.userId)
      );
      console.log(activeUsers);
    });

    // Clean up socket connections when the component unmounts
    return () => {
      socket.off("update_user");
      socket.off("remove_user");
    };
  }, []);

  const insertTable = (row, col) => {
    editor
      ?.chain()
      .focus()
      .insertTable({ rows: row, cols: col, withHeaderRow: false })
      .run();
  };

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

  const onSaveHTML = () => {
    if (!editor) return;
    const content = editor.getHTML();
    const blob = new Blob(content, {
      type: "text/html",
    });
    onDownload(blob, "document.html");
  };

  const onSaveText = () => {
    if (!editor) return;
    const content = editor.getText();
    const blob = new Blob(content, {
      type: "text/plain",
    });
    onDownload(blob, "document.txt");
  };

  return (
    <nav className="flex items-center">
      <div className="flex gap-2 items-center">
        <Link to="/">
          <img src={logo} alt="logo" width={36} height={36} />
        </Link>
      </div>
      <div className="flex flex-col ml-2">
        <DocumentInput room={room} />
        <div className="flex ml-1">
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
                      onClick={onSaveJSON}
                      className="hover:bg-[#fafbfd] cursor-pointer"
                    >
                      <FileJsonIcon className="size-4 mr-2" />
                      JSON
                    </MenubarItem>
                    <MenubarItem
                      onClick={onSaveHTML}
                      className="hover:bg-[#fafbfd] cursor-pointer"
                    >
                      <GlobeIcon className="size-4 mr-2" />
                      HTML
                    </MenubarItem>
                    <MenubarItem
                      onClick={() => window.print()}
                      className="hover:bg-[#fafbfd] cursor-pointer"
                    >
                      <FileIcon className="size-4 mr-2" />
                      PDF
                    </MenubarItem>
                    <MenubarItem
                      onClick={onSaveText}
                      className="hover:bg-[#fafbfd] cursor-pointer"
                    >
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
                <MenubarItem
                  onClick={() => editor?.chain().focus().undo().run()}
                >
                  <Undo2Icon className="size-4 mr-2" />
                  Undo
                </MenubarItem>
                <MenubarItem
                  onClick={() => editor?.chain().focus().redo().run()}
                >
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
                    <MenubarItem onClick={() => insertTable(1, 1)}>
                      1 X 1
                    </MenubarItem>
                    <MenubarItem onClick={() => insertTable(2, 2)}>
                      2 X 2
                    </MenubarItem>
                    <MenubarItem onClick={() => insertTable(3, 3)}>
                      3 X 3
                    </MenubarItem>
                    <MenubarItem onClick={() => insertTable(4, 4)}>
                      4 X 4
                    </MenubarItem>
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
                    <MenubarItem
                      onClick={() => editor?.chain().focus().toggleBold().run()}
                      className="hover:bg-[#fafbfd] cursor-pointer"
                    >
                      <BoldIcon className="size-4 mr-2" />
                      Bold <MenubarShortcut> Ctrl+B</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem
                      onClick={() =>
                        editor?.chain().focus().toggleItalic().run()
                      }
                      className="hover:bg-[#fafbfd] cursor-pointer"
                    >
                      <ItalicIcon className="size-4 mr-2" />
                      Italic <MenubarShortcut> Ctrl+I</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem
                      onClick={() =>
                        editor?.chain().focus().toggleUnderline().run()
                      }
                      className="hover:bg-[#fafbfd] cursor-pointer"
                    >
                      <UnderlineIcon className="size-4 mr-2" />
                      Underline <MenubarShortcut> Ctrl+U</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem
                      onClick={() =>
                        editor?.chain().focus().toggleStrike().run()
                      }
                      className="hover:bg-[#fafbfd] cursor-pointer"
                    >
                      <StrikethroughIcon className="size-4 mr-2" />
                      Strikethrough&nbsp;&nbsp;
                      <MenubarShortcut> Ctrl+S</MenubarShortcut>
                    </MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
                <MenubarItem
                  onClick={() => editor?.chain().focus().unsetAllMarks().run()}
                >
                  <RemoveFormattingIcon className="size-4 mr-2" />
                  Clear Formatting
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </div>

      <div className="w-full flex items-center justify-end relative">
        {/* Active Users Section */}
        <div className="flex items-center space-x-4 overflow-x-auto px-2">
          {activeUsers.map((data) => (
            <CustomAvatar key={data.userId} name={data.userName} />
          ))}
        </div>
        {allowToAddCollaborator === user?.userId && <ShareDocument />}
        <UserProfile />
      </div>
    </nav>
  );
};

export default Navbar;
