import { Router } from "express";
import {
  createDocument,
  getAllUserDocument,
  getDocumentById,
} from "../../controllers/document.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

export const DocumentRouter = Router();

DocumentRouter.post("/createDocument", authMiddleware, createDocument);
DocumentRouter.post("/getUserDocument", authMiddleware, getAllUserDocument);
DocumentRouter.get("/:id", authMiddleware, getDocumentById);
