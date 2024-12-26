import { Router } from "express";
import {
  createOrganization,
  fetchOrganizationBasedOnUserID,
  sendInvitation,
} from "../../controllers/organization.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

export const OrganizationRouter = Router();

OrganizationRouter.post(
  "/createOrganization",
  authMiddleware,
  createOrganization
);

OrganizationRouter.get(
  "/getOrganization",
  authMiddleware,
  fetchOrganizationBasedOnUserID
);

OrganizationRouter.post("/sendInvitation", sendInvitation);
