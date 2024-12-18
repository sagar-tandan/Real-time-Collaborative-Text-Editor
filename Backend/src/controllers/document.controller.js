import Document from "../models/document.model.js";

export const createDocument = async (req, res, next) => {
  const { doc_id, content } = req.body;
  try {
    if (!doc_id) {
      res.status(400).json({ message: "Docuemnt ID not found" });
    }

    const newDocument = await Document.create({
      doc_id: doc_id,
      content: content,
    });

    res.status(200).json(newDocument);
  } catch (error) {
    next(error);
  }
};
