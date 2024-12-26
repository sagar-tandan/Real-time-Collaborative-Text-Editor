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

    // Loop through each email
    for (let email of emailArray) {
      const user = await User.findOne({ email });

      if (!user) {
        // If user is not found, skip and return an error for that specific email
        return res
          .status(404)
          .json({ message: `User with email ${email} not found.` });
      }

      // Check if user is already in the organization
      const userExistsInOrg =
        organization.members.some(
          (member) => member.userId.toString() === user._id.toString()
        ) ||
        organization.admin.some(
          (admin) => admin.adminId.toString() === user._id.toString()
        );

      if (userExistsInOrg) {
        return res.status(400).json({
          message: `User with email ${email} is already part of the organization.`,
        });
      }

      // Add the user to the appropriate role in the organization
      if (role === "member") {
        organization.members.push({
          userId: user._id,
          memberStatus: "pending", // Set status to pending for now
        });
      } else if (role === "admin") {
        organization.admin.push({
          adminId: user._id,
          adminStatus: "pending", // Set status to pending for now
        });
      } else {
        return res.status(400).json({ message: "Invalid role specified." });
      }
    }

    // Save the updated organization
    await organization.save();

    // Return success response
    return res.status(200).json({
      message: "Users successfully added to the organization.",
      organization,
    });
  } catch (error) {
    // Error handling
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while processing the invitation." });
  }
};
