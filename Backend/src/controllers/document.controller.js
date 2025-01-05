import Document from "../models/document.model.js";
import User from "../models/user.model.js";

export const createDocument = async (req, res, next) => {
  // console.log(req.body);
  const { doc_id, ownerId, ownerName, ownerEmail, doc_title, doc_type } =
    req.body;
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
      doc_type: doc_type,
      collaborators: [ownerId],
    });

    res.status(200).json(newDocument);
  } catch (error) {
    next(error);
  }
};

export const updateDocumentName = async (req, res, next) => {
  try {
    const { docId, documentName, userId } = req.body;

    if (!docId) {
      return res.status(400).json({ message: "Document ID is required" });
    }

    if (!documentName) {
      return res.status(400).json({ message: "Document name is required" });
    }

    const UpdateDoc = await Document.findOne({ doc_id: docId });
    if (!UpdateDoc) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (UpdateDoc.createdBy.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this document" });
    }

    UpdateDoc.doc_title = documentName;
    await UpdateDoc.save();

    return res.status(200).json({
      message: "Document name successfully updated",
      UpdateDoc,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const deleteDocument = async (req, res, next) => {
  try {
    const { docId, userId } = req.body;
    if (!docId || !userId) {
      return res
        .status(400)
        .json({ message: "Document ID and user ID is required" });
    }

    const deleteDoc = await Document.findOne({ doc_id: docId });
    if (!deleteDoc) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (deleteDoc.createdBy.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this document" });
    }

    await Document.deleteOne({ doc_id: docId });

    return res.status(200).json({
      message: "Document successfully deleted",
      deletedDoc: deleteDoc,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getAllUserDocument = async (req, res, next) => {
  const { userId } = req.body;
  try {
    if (!userId) {
      return res.status(400).json({ message: "No user ID" });
    }
    const personalDocuments = await Document.find({ createdBy: userId }).sort({
      updatedAt: -1,
    });

    const collaborativeDocuments = await Document.find({
      collaborators: userId,
      createdBy: { $ne: userId },
    }).sort({ updatedAt: -1 });

    // Merge both arrays and sort by `updatedAt` in descending order
    const mergedDocuments = [
      ...personalDocuments,
      ...collaborativeDocuments,
    ].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    res.status(200).json(mergedDocuments);
  } catch (error) {
    next(error);
  }
};

export const getDocumentById = async (req, res, next) => {
  const { id } = req.params; // Extracting the document ID from the URL
  const { userId } = req.query;

  try {
    if (!userId || !id) {
      return res
        .status(400)
        .json({ message: "User ID and Document ID are required" });
    }

    const document = await Document.findOne({ doc_id: id });

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

export const addCollaborators = async (req, res, next) => {
  try {
    const { docId, emails, ownerId } = req.body;
    console.log(docId, emails, ownerId);
    if (!docId || !emails || !ownerId) {
      return res.status(400).json({ message: "These fields cannot be null" });
    }

    const document = await Document.findOne({ doc_id: docId.id });

    if (!document) {
      return res.status(400).json({ message: "Document not found" });
    }
    if (document.createdBy.toString() !== ownerId) {
      return res.status(403).json({ message: "Unauthorized user" });
    }

    const validUserIds = [];
    const missingEmails = [];

    for (const email of emails) {
      const user = await User.findOne({ email });
      if (user) {
        if (!document.collaborators.includes(user._id.toString())) {
          validUserIds.push(user._id);
        }
      } else {
        missingEmails.push(email);
      }
    }

    if (missingEmails.length > 0) {
      return res.status(404).json({
        message: "Some emails do not exists",
        missingEmails,
      });
    }

    document.collaborators.push(...validUserIds);
    await document.save();
    return res
      .status(200)
      .json({ message: "Collaborators added successfully", document });
  } catch (error) {
    next(error);
  }
};
