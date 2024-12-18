import { model, Schema } from "mongoose";

const documentSchema = new Schema({
  doc_id: { type: String, required: true },
  content: { type: String },
});

const Document = model("Document", documentSchema);
export default Document;
