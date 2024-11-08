import { InferSchemaType, model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, select: false },
    password: { type: String, required: true, select: false },
  },
  { timestamps: true }
);

type userType = InferSchemaType<typeof userSchema>;

const User = model<userType>("User", userSchema);
export default User;
