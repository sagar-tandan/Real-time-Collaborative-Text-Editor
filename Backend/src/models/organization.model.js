import { Schema, model } from "mongoose";

// Define the Organization schema
const OrganizationSchema = new Schema(
  {
    organizationName: { type: String, required: true },
    logo: { type: String, required: true },
    orgSlug: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
      },
    ],
    // Admins are also users, so they are referenced here
    admin: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    // References to documents
    documentsId: [{ type: Schema.Types.ObjectId, ref: "Document" }],
  },
  {
    timestamps: true,
  }
);

const Organization = model("Organization", OrganizationSchema);
export default Organization;
