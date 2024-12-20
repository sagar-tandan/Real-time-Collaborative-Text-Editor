import Document from "../models/document.model.js";

export const createDocument = async (req, res, next) => {
  console.log(req.body);
  const { doc_id, ownerId, ownerName, ownerEmail, doc_title } = req.body;
  try {
    if (!doc_id) {
      res.status(400).json({ message: "Docuemnt ID not found" });
    }

    const newDocument = await Document.create({
      doc_id: doc_id,
      content: `[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"Start documenting...."}]}]`,
      createdBy: ownerId,
      ownerName: ownerName,
      ownerEmail: ownerEmail,
      doc_title: doc_title,
      collaborators: [ownerId],
    });

    res.status(200).json(newDocument);
  } catch (error) {
    next(error);
  }
};

export const getAllUserDocument = async (req, res, next) => {
  const { userId } = req.body;
  try {
    if (!userId) {
      return res.status(400).json({ message: "No user ID" });
    }
    const allDocuments = await Document.find({ createdBy: userId }).sort({
      updatedAt: "descending",
    });
    res.status(200).json(allDocuments);
  } catch (error) {
    next(error);
  }
};
