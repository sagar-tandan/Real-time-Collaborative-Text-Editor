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

export const getDocumentById = async (req, res, next) => {
  console.log("Here");
  const { userId, docId } = req.params;
  try {
    if (!userId || !docId) {
      return res
        .status(400)
        .json({ message: "User ID and Document ID are required" });
    }

    const document = await Document.findOne({ doc_id: docId });

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Check if the user is the creator or a collaborator
    const canEdit =
      document.createdBy.toString() === userId ||
      document.collaborators.some(
        (collaborator) => collaborator.toString() === userId
      );

    res.status(200).json({ document, canEdit });
  } catch (error) {
    next(error);
  }
};
