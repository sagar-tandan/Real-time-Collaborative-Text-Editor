import mongoose from "mongoose";
import Organization from "../models/organization.model.js";

export const createOrganization = async (req, res, next) => {
  try {
    // Get orgName and createdBy from the request body
    const { orgName, createdBy, imageUrl, orgSlug } = req.body;
    console.log(req.body);

    // Validate the ObjectId
    if (!mongoose.Types.ObjectId.isValid(createdBy)) {
      return res.status(400).json({ error: "Invalid ObjectId" });
    }

    // Convert the createdBy string to ObjectId
    const createdByObjectId = new mongoose.Types.ObjectId(createdBy);

    const newOrganization = await Organization.create({
      logo: imageUrl,
      orgSlug: orgSlug,
      organizationName: orgName,
      createdBy: createdByObjectId,
      admin: [createdByObjectId],
    });

    // Respond with the saved organization
    return res.status(201).json(newOrganization);
  } catch (error) {
    console.error("Error creating organization:", error);
    next(error);
  }
};

export const fetchOrganizationBasedOnUserID = async (req, res, next) => {
  try {
    // Get orgName and createdBy from the request body
    const { userId } = req.query;

    //  Convert the createdBy string to ObjectId
    // const createdByObjectId = new mongoose.Types.ObjectId(userId);

    const getOrganization = await Organization.find({
      createdBy: userId,
    });

    // // Respond with the saved organization
    return res.status(201).json(getOrganization);
  } catch (error) {
    console.error("Error creating organization:", error);
    next(error);
  }
};
