import React, { useContext, useEffect, useState } from "react";
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
  onLoadDocument,
  onCursorMove,
  onLoadCursor,
} from "@/Socket/Socket";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FontSizeExtension } from "@/Custom_Extensions/FontSize";
// import Collaboration from "@tiptap/extension-collaboration";
// import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
// import { HocuspocusProvider } from "@hocuspocus/provider";

// import { WebrtcProvider } from "y-webrtc";
// import * as Y from "yjs";

// Set up the Hocuspocus WebSocket provider
// const provider = new HocuspocusProvider({
//   url: "'ws:://localhost:8000",
//   name: "example-document",
// });

const extensions = [
  StarterKit,
  FontSizeExtension,
  TaskList,
  TaskItem.configure({ nested: true }),
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
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  BulletList,
  OrderedList,
  ListItem,

  // // Register the document with Tiptap
  // Collaboration.configure({
  //   document: provider.document,
  // }),
  // // Register the collaboration cursor extension
  // CollaborationCursor.configure({
  //   provider: provider,
  //   user: {
  //     name: "Cyndi Lauper",
  //     color: "#f783ac",
  //   },
  // }),
];

const Editor = () => {
  const { setEditor, user, endPoint, token, canEditDocs, setCanEditDocs,setAllowToAddCollaborator } =
    useContext(MyContext);
  const documentId = useParams();
  const [lastSavedContent, setLastSavedContent] = useState(null);
  const navigate = useNavigate();
  // const [lastCursorPosition, setLastCursorPosition] = useState(null); // Track last cursor position

  const editor = useEditor({
    onCreate({ editor }) {
      setEditor(editor);
    },
    onDestroy() {
      setEditor(null);
    },
    onUpdate({ editor }) {
      const currentContent = editor.getJSON();
      const { from } = editor.state.selection;
      sendUpdate({ currentContent, from });
    },

    onSelectionUpdate({ editor }) {
      setEditor(editor);
      // if (from !== lastCursorPosition) {
      //   // Avoid emitting if the position hasn't changed
      //   onCursorMove(from);
      //   setLastCursorPosition(from); // Update the last known position
      // }
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
        style: "padding-left: 56px; padding-right: 56px;",
        class:
          "focus:outline-none bg-white border border-[#C7C7C7] min-h-[1054px] w-[816px] py-10 pr-14 cursor-text ",
      },
    },
    extensions,
    editable: canEditDocs, // Editable flag based on canEditDocs state
  });

  useEffect(() => {
    if (editor) {
      editor.setEditable(canEditDocs);
    }
  }, [canEditDocs, editor]); // Re-run this effect when `canEditDocs` changes

  useEffect(() => {
    if (!user?.userId || !documentId?.id) {
      navigate("/login");
      return;
    }

    const fetchDetail = async () => {
      try {
        const response = await axios.get(
          `${endPoint}/api/document/${documentId?.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: { userId: user?.userId },
          }
        );

        if (response.status === 200) {
          console.log(response);
          setCanEditDocs(response.data.canEdit);
          setAllowToAddCollaborator(response.data.document.createdBy);
          editor?.commands.setContent(
            JSON.parse(response.data.document.content)
          );
          setLastSavedContent(JSON.parse(response.data.document.content));
        } else {
          console.log("Failed to fetch document, status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchDetail();
  }, [user?.userId, documentId?.id, endPoint, token, editor, setCanEditDocs]);

  useEffect(() => {
    if (documentId) {
      sendDocumentId(documentId);
    }

    const loadDocumentHandler = (content) => {
      if (editor) {
        editor.commands.setContent(JSON.parse(content));
        setLastSavedContent(JSON.parse(content));
      }
    };

    onLoadDocument(loadDocumentHandler);

    return () => {
      socket.off("load-document", loadDocumentHandler);
    };
  }, [documentId, editor]);

  useEffect(() => {
    if (!editor) return;

    const saveContent = () => {
      const currentContent = editor.getJSON();
      const currentContentString = JSON.stringify(currentContent);
      const lastSavedContentString = JSON.stringify(lastSavedContent);

      if (currentContentString !== lastSavedContentString) {
        socket.emit("save-content", { documentId, content: currentContent });
        setLastSavedContent(currentContent);
      }
    };

    const intervalId = setInterval(saveContent, 5000);

    return () => clearInterval(intervalId);
  }, [editor, documentId, lastSavedContent]);

  useEffect(() => {
    const updateHandler = (delta) => {
      console.log(delta);
      if (editor) {
        const currentContent = editor.getJSON();
        const deltaString = JSON.stringify(delta.currentContent.content);
        const currentContentString = JSON.stringify(currentContent);

        if (deltaString !== currentContentString) {
          editor.commands.setContent(delta.currentContent.content);
          setLastSavedContent(delta.currentContent.content);
        }
      }
    };

    // const cursorHandler = (position) => {
    //   console.log(position);
    //   if (editor) {
    //     // if(senderId )
    //     // Set the cursor at the received position
    //     // editor.commands.setTextSelection({ from: position, to: position });
    //     // editor.commands.insertContent("<div class='vertical-line'></div>");
    //   }
    // };

    onReceiveUpdate(updateHandler);
    // onLoadCursor(cursorHandler);

    return () => {
      cleanupSocket();
      socket.off("receive-update", updateHandler);
      // socket.off("show-cursor", cursorHandler);
    };
  }, [editor]);

  return (
    <div className="size-full overflow-x-auto bg-[#F9FBFD] px-4 print:p-0 print:overflow-visible print:bg-white">
      <div className="min-w-max flex justify-center w-[816px] py-4 mx-auto print:py-0 print:w-full print:min-w-0">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default Editor;
