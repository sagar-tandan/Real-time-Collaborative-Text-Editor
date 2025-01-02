import { Router } from "express";
import {
  createOrganization,
  createOrganizationalDocuments,
  fetchOrganizationBasedOnUserID,
  getOrganizationDocuments,
  joinOrganization,
  sendInvitation,
  deleteOrganization,
  leaveOrganization,
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
OrganizationRouter.post("/joinOrganization", joinOrganization);

OrganizationRouter.get(
  "/getdocuments",
  authMiddleware,
  getOrganizationDocuments
);

OrganizationRouter.post(
  "/createDocument",
  authMiddleware,
  createOrganizationalDocuments
);

OrganizationRouter.post(
  "/leave-organization",
  authMiddleware,
  leaveOrganization
);

OrganizationRouter.post(
  "/delete-organization",
  authMiddleware,
  deleteOrganization
);
