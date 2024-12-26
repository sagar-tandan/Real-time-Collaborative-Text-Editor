import { Schema, model } from "mongoose";
import { type } from "os";

// Define the Organization schema
const OrganizationSchema = new Schema(
  {
    organizationName: { type: String, required: true },
    logo: { type: String, required: false },
    orgSlug: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        memberStatus: { type: String, required: true },
      },
    ],
    // Admins are also users, so they are referenced here
    admin: [
      {
        adminId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        adminStatus: { type: String, required: true },
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
