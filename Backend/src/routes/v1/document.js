import { Router } from "express";
import { createDocument } from "../../controllers/document.controller.js";

export const DocumentRouter = Router();

DocumentRouter.post("/createDocument", createDocument);
