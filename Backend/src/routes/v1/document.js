import { Router } from "express";
import {
  createDocument,
  deleteDocument,
  getAllUserDocument,
  getDocumentById,
  updateDocumentName,
} from "../../controllers/document.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

export const DocumentRouter = Router();

DocumentRouter.post("/createDocument", authMiddleware, createDocument);
DocumentRouter.post("/getUserDocument", authMiddleware, getAllUserDocument);
DocumentRouter.post("/deleteDocument", authMiddleware, deleteDocument);
DocumentRouter.post("/updateDocument", authMiddleware, updateDocumentName);
DocumentRouter.get("/:id", authMiddleware, getDocumentById);
