import { Router } from "express";
import { createDocument } from "../../controllers/document.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

export const DocumentRouter = Router();

DocumentRouter.post("/createDocument", authMiddleware, createDocument);
