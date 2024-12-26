import mongoose from "mongoose";
import Organization from "../models/organization.model.js";
import User from "../models/user.model.js";

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
      admin: [
        {
          adminId: createdByObjectId,
          adminStatus: "accepted",
        },
      ],
      members: [
        {
          userId: createdByObjectId,
          memberStatus: "accepted",
        },
      ],
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
      $or: [{ "members.userId": userId }, { "admin.adminId": userId }],
    });

    // // Respond with the saved organization
    return res.status(201).json(getOrganization);
  } catch (error) {
    console.error("Error creating organization:", error);
    next(error);
  }
};

export const sendInvitation = async (req, res, next) => {
  try {
    const { email, role, orgName } = req.body;

    if (!email || !role || !orgName) {
      return res
        .status(400)
        .json({ message: "Email, role, and organization name are required." });
    }

    const emailArray = Array.isArray(email) ? email : [email];

    const organization = await Organization.findOne({
      organizationName: orgName,
    });

    if (!organization) {
      return res.status(404).json({ message: "Organization not found." });
    }

    // const userIdsToAdd = [];

    for (let email of emailArray) {
      const user = await User.findOne({ email });

      if (!user) {
        // Skip if user is not found for this email
        return res
          .status(404)
          .json({ message: `User with email ${email} not found.` });
      }

      // userIdsToAdd.push(user._id);

      if (role === "member") {
        organization.members.push({
          userId: user._id,
          memberStatus: "pending",
        });
      } else if (role === "admin") {
        organization.admin.push({
          userId: user._id,
          adminStatus: "pending",
        });
      } else {
        return res.status(400).json({ message: "Invalid role specified." });
      }
    }

    // Step 6: Save the updated organization
    await organization.save();

    // Step 7: Send response with all users added to the organization
    return res.status(200).json({
      message: "Users successfully added to the organization.",
      organization,
    });
  } catch (error) {
    // Step 8: Error handling
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while processing the invitation." });
  }
};
