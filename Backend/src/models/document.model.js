import { model, Schema } from "mongoose";

const documentSchema = new Schema(
  {
    doc_id: { type: String, required: true },
    doc_title: {
      type: String,
      required: true,
      trim: true,
      default: "Untitled Document",
    },

    content: {
      type: String,
      required: true,
    },
    doc_type: {
      type: String,
      required: true,
    },

    // The user who created the document
    createdBy: {
      type: Schema.Types.ObjectId, // Reference to the User model (_id of the user)
      ref: "User", // Specifies that this is a reference to the 'User' model
      required: true,
    },

    ownerName: {
      type: String,
      required: true,
    },
    ownerEmail: {
      type: String,
      required: true,
    },

    // List of collaborators
    collaborators: [
      {
        type: Schema.Types.ObjectId, // Reference to User (_id of collaborators)
        ref: "User", // Specifies that these are references to 'User' model
        required: true,
      },
    ],

    Marginposition: {
      leftMargin: { type: Number, required: true },
      rightMargin: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

const Document = model("Document", documentSchema);
export default Document;
