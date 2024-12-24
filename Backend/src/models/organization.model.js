import { Schema, model } from "mongoose";

// Define the Organization schema
const OrganizationSchema = new Schema(
  {
    organizationName: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user who created the organization
    members: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User
        role: { type: String, enum: ["admin", "member"], required: true } // Role of the member
      }
    ],
    admin: [
      {
        type: Schema.Types.ObjectId, 
        ref: "User", 
        required: true // Admins are also users, so they are referenced here
      }
    ],
    documentsId: [
      { type: Schema.Types.ObjectId, ref: "Document" } // References to documents
    ]
  },
  {
    timestamps: true // Automatically adds `createdAt` and `updatedAt` fields
  }
);

const Organization = model("Organization", OrganizationSchema);
export default Organization;
