import { InferSchemaType, model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

type userType = InferSchemaType<typeof userSchema>;

const User = model<userType>("User", userSchema);
export default User;
