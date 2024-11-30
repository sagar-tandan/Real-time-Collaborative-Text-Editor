import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    location: { type: String, required: false },
    summary: { type: String, required: false },
  },
  { timestamps: true }
);

const User = model("User", userSchema);
export default User;
