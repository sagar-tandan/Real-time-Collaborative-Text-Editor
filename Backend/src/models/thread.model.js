import { Schema } from "mongoose";

const commentSchema = new Schema({
  comment_id: { type: String, required: true },
  user_id: { type: String, required: true },
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const threadSchema = new Schema({
  doc_id: { type: Schema.Types.ObjectId, ref: "Document" },
  text_range: {
    start: { type: Number, required: true },
    end: { type: Number, required: true },
  },
  comments: [commentSchema],
  status: { type: String, required: true },
  created_by: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const Thread = mongoose.model("Thread", threadSchema);

export default Thread;
