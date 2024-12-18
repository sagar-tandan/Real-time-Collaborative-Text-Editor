import React, { useContext, useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Image from "@tiptap/extension-image";
import ImageResize from "tiptap-extension-resize-image";
import MyContext from "../../../Context/MyContext";
import Underline from "@tiptap/extension-underline";
import FontFamily from "@tiptap/extension-font-family";
import TextStyle from "@tiptap/extension-text-style";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import { Color } from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import socket, {
  sendUpdate,
  onReceiveUpdate,
  cleanupSocket,
  sendDocumentId,
} from "@/Socket/Socket";
import { useParams } from "react-router-dom";

// define your extension array
const extensions = [
  StarterKit,
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  Table,
  TableRow,
  TableHeader,
  TableCell,
  Image,
  ImageResize,
  Underline,
  TextStyle,
  FontFamily,
  Heading,
  Highlight.configure({ multicolor: true }),
  Color,
  Link.configure({
    openOnClick: false,
    autolink: true,
    defaultProtocol: "https",
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  BulletList,
  OrderedList,
  ListItem,
];

const Editor = () => {
  const { setEditor } = useContext(MyContext);
  const documentId = useParams();

  useEffect(() => {
    sendDocumentId(documentId);
  }, []);

  const editor = useEditor({
    onCreate({ editor }) {
      setEditor(editor);
      // previousContent.current = editor.getJSON();
    },
    onDestroy() {
      setEditor(null);
    },
    onUpdate({ editor }) {
      // setEditor(editor);
      const currentContent = editor.getJSON();
      // if (currentContent !== previousContent.current) {
      //   const delta = getDelta(previousContent.current, currentContent);
      //   sendUpdate(delta); // Send delta updates to the server
      //   previousContent.current = currentContent;
      // }
      sendUpdate(currentContent); // Send delta updates to the server
    },
    onSelectionUpdate({ editor }) {
      setEditor(editor);
    },
    onBlur({ editor }) {
      setEditor(editor);
    },
    onTransaction({ editor }) {
      setEditor(editor);
    },
    onFocus({ editor }) {
      setEditor(editor);
    },
    onContentError({ editor }) {
      setEditor(editor);
    },
    editorProps: {
      attributes: {
        style: "padding-left: 56px; padding-right: 56px; ",
        class:
          "focus:outline-none bg-white print:border-0 border border-[#C7C7C7] flex flex-col min-h-[1054px] w-[816px] py-10 pr-14 cursor-text",
      },
    },
    extensions,
  });

  useEffect(() => {
    // Receive updates and apply them to the editor
    onReceiveUpdate((delta) => {
      if (editor) {
        editor.commands.setContent(delta);
        // console.log(delta);
        // localStorage.setItem("latest-update", delta);
      }
    });

    return () => {
      cleanupSocket();
    };
  }, [editor]);

  // // Utility function to calculate the difference (delta)
  // function getDelta(oldContent, newContent) {
  //   const diff = newContent.replace(oldContent, ""); // Simple difference logic
  //   return diff;
  // }

  return (
    <div className="size-full overflow-x-auto bg-[#F9FBFD] px-4 print:p-0 print:overflow-visible print:bg-white">
      <div className="min-w-max flex justify-center w-[816px] py-4 mx-auto print:py-0 print:w-full print:min-w-0">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default Editor;
