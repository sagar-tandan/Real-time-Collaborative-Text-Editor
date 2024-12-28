import { Extension } from "@tiptap/react";

export const FontSizeExtension = Extension.create({
  name: "fontSize",

  addOptions() {
    return {
      types: ["textStyle"], // Ensure `textStyle` mark is included in your editor
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types, // Apply to specified types
        attributes: {
          fontSize: { // Define the `fontSize` attribute
            default: null,
            parseHTML: (element) => element.style.fontSize,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize) =>
        ({ chain }) => {
          return chain().updateAttributes("textStyle", { fontSize }).run(); // Use `updateAttributes` for nodes/marks
        },
    };
  },
});
