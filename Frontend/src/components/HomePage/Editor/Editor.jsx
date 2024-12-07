import React from "react";
import {
  useEditor,
  EditorContent,
  FloatingMenu,
  BubbleMenu,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

// define your extension array
const extensions = [StarterKit];

const content = "<p>Hello World!</p>";

const Editor = () => {
  const editor = useEditor({
    editorProps: {
      attributes: {
        style: "padding-left: 56px; padding-right: 56px; ",
        class:
          "focus:outline-none bg-white print:border-0 border border-[#C7C7C7] flex flex-col min-h-[1054px] min-w-[816px] py-10 pr-14 cursor-text",
      },
    },
    extensions,
    content,
  });
  return (
    <div className="w-full overflow-x-auto bg-[#F9FBFD] px-4 print:p-0 print:overflow-visible print:bg-white">
      <div className="min-w-max flex justify-center w-[816px] py-4 mx-auto print:py-0 print:w-full print:min-w-0">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default Editor;
