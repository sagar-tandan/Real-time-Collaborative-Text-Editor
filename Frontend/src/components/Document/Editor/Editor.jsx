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

import CharacterCount from "@tiptap/extension-character-count";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";

import { FontSizeExtension } from "@/Custom_Extensions/FontSize";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "@/Socket/Socket";
import { useToast } from "@/hooks/use-toast";
import Ruler from "../Toolbar/Ruler";

import { debounce } from "lodash";

const extensions = [
  StarterKit.configure({
    history: false,
  }),
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
];

const colors = [
  "#958DF1",
  "#F98181",
  "#FBBC88",
  "#FAF594",
  "#70CFF8",
  "#94FADB",
  "#B9F18D",
  "#C3E2C2",
  "#EAECCC",
  "#AFC8AD",
  "#EEC759",
  "#9BB8CD",
  "#FF90BC",
  "#FFC0D9",
  "#DC8686",
  "#7ED7C1",
  "#F3EEEA",
  "#89B9AD",
  "#D0BFFF",
  "#FFF8C9",
  "#CBFFA9",
  "#9BABB8",
  "#E3F4F4",
];

const getRandomElement = (list) =>
  list[Math.floor(Math.random() * list.length)];

const getRandomColor = () => getRandomElement(colors);

const Editor = ({ ydoc, provider, room }) => {
  const {
    setEditor,
    user,
    endPoint,
    token,
    canEditDocs,
    setCanEditDocs,
    setAllowToAddCollaborator,
    rightMargin,
    leftMargin,
    setDocumentName,
    setSaving,
  } = useContext(MyContext);

  const [status, setStatus] = useState("connecting");

  const [currentUser, setCurrentUser] = useState({
    name: user?.userName,
    color: getRandomColor(),
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const editor = useEditor({
    enableContentCheck: true,
    onContentError: ({ disableCollaboration }) => {
      disableCollaboration();
    },
    immediatelyRender: false,

    onCreate({ editor }) {
      setEditor(editor);
    },
    onDestroy() {
      setEditor(null);
    },

    onUpdate({ editor }) {
      setEditor(editor);
      setSaving(true);
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
      if (canEditDocs) {
        socket.emit("new_user", { room, user });
      }
    },

    editorProps: {
      attributes: {
        style: `padding-left: ${leftMargin}px; padding-right: ${rightMargin}px;`,
        class:
          "focus:outline-none bg-white border border-[#C7C7C7] min-h-[1054px] w-[816px] py-10 pr-14 cursor-text ",
      },
    },
    extensions: [
      ...extensions,
      CharacterCount.extend().configure({
        limit: 10000,
      }),
      Collaboration.extend().configure({
        document: ydoc,
      }),
      CollaborationCursor.extend().configure({
        provider,
      }),
    ],
    editable: canEditDocs,
  });

  useEffect(() => {
    const statusHandler = (event) => {
      setStatus(event.status);
    };

    provider.on("status", statusHandler);

    return () => {
      provider.off("status", statusHandler);
    };
  }, [provider, editor]);

  // Save current user to localStorage and emit to editor
  useEffect(() => {
    if (editor && currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      editor.chain().focus().updateUser(currentUser).run();

      socket.emit("user-connected", { currentUser, room });
      socket.on("user-notify", (data) => {
        toast({
          className: "bg-blue-300 font-medium text-lg ",
          description: `${data.name} has joined the document.`,
        });
      });
    }
  }, [editor, currentUser]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(canEditDocs);
    }
  }, [canEditDocs, editor]);

  useEffect(() => {
    if (!user?.userId || !room) {
      navigate("/login");
      return;
    }

    const fetchDetail = async () => {
      try {
        const response = await axios.get(`${endPoint}/api/document/${room}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { userId: user?.userId },
        });

        if (response.status === 200) {
          console.log(response);
          setCanEditDocs(response.data.canEdit);
          setAllowToAddCollaborator(response.data.document.createdBy);
          setDocumentName(response.data.document.doc_title);
          // editor?.commands.setContent(
          //   JSON.parse(response.data.document.content)
          // );
          // setLastSavedContent(JSON.parse(response.data.document.content));
        } else {
          console.log("Failed to fetch document, status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchDetail();
  }, [user?.userId, room, endPoint, token, editor, setCanEditDocs]);

  //  --------------------------------- Save Data to database-------------------------

  useEffect(() => {
    if (editor) {
      const debouncedSave = debounce(() => {
        if (editor?.isEmpty) return; // Don't save if the document is empty

        const docContent = editor.getJSON();
        saveDocument(docContent);
      }, 2000); // Debounce for 2000 milliseconds

      editor.on("update", () => {
        debouncedSave();
      });

      return () => {
        debouncedSave.cancel();
        editor.off("update", debouncedSave);
        // Detach the event listener on cleanup
      };
    }
  }, [editor]);

  const saveDocument = async (content) => {
    try {
      const response = await axios.post(
        `${endPoint}/api/document/save-document`,
        {
          doc_id: room,
          content: content,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        console.log("Document saved successfully");
        setSaving(false);
      }
    } catch (error) {
      console.error("Error saving document:", error);
      setSaving(false);
    }
  };

  return (
    <div className="size-full overflow-x-auto bg-[#F9FBFD] px-4 print:p-0 print:overflow-visible print:bg-white">
      {canEditDocs && <Ruler room={room} />}
      <div className="min-w-max flex justify-center w-[816px] py-4 mx-auto print:py-0 print:w-full print:min-w-0 ">
        <EditorContent editor={editor} />
        {/* <Threads editor={editor} /> */}
      </div>
    </div>
  );
};

export default Editor;
