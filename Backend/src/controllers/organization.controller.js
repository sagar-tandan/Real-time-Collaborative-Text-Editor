import mongoose, { mongo } from "mongoose";
import Organization from "../models/organization.model.js";
import User from "../models/user.model.js";
import Document from "../models/document.model.js";

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

export const joinOrganization = async (req, res, next) => {
  try {
    const { userId, orgId } = req.body;

    if (!userId || !orgId) {
      return res
        .status(400)
        .json({ message: "User ID and Organization ID are required." });
    }

    // Find the organization by ID
    const organization = await Organization.findById(orgId);

    if (!organization) {
      return res.status(404).json({ message: "Organization not found." });
    }

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the user is a member of the organization
    const memberIndex = organization.members.findIndex(
      (member) =>
        member.userId.toString() === user._id.toString() &&
        member.memberStatus === "pending"
    );

    if (memberIndex !== -1) {
      // Update the member status to "accepted"
      organization.members[memberIndex].memberStatus = "accepted";
    } else {
      // Check if the user is an admin of the organization
      const adminIndex = organization.admin.findIndex(
        (admin) =>
          admin.adminId.toString() === user._id.toString() &&
          admin.adminStatus === "pending"
      );

      if (adminIndex !== -1) {
        // Update the admin status to "accepted"
        organization.admin[adminIndex].adminStatus = "accepted";
      } else {
        // User is not part of the organization as a pending member or admin
        return res.status(400).json({
          message:
            "User is not a pending member or admin of this organization.",
        });
      }
    }

    // Save the updated organization
    await organization.save();

    // Return success response
    return res.status(200).json({
      message:
        "User successfully joined the organization and status updated to accepted.",
      organization,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while processing the join request.",
    });
  }
};

export const getOrganizationDocuments = async (req, res, next) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: "Organization ID is required" });
    }

    const organization = await Organization.findById(id)
      .populate("documentsId", "-__v")
      .exec();

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Return the populated documents directly
    return res.status(200).json({ documents: organization.documentsId });
  } catch (error) {
    next(error);
  }
};

export const createOrganizationalDocuments = async (req, res, next) => {
  const { doc_id, ownerId, ownerName, ownerEmail, doc_title, doc_type, orgId } =
    req.body;

  try {
    // Validate inputs
    if (!doc_id) {
      return res.status(400).json({ message: "Document ID is required." });
    }

    if (!orgId) {
      return res.status(400).json({ message: "Organization ID is required." });
    }

    // Create a new document
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

    // Find the organization and update its document list
    const organizationDoc = await Organization.findById(orgId);
    if (!organizationDoc) {
      return res.status(404).json({ message: "Organization not found." });
    }

    // Push the doc_id into documentsId
    organizationDoc.documentsId.push(newDocument._id);
    await organizationDoc.save();
    console.log("Updated Organization:", organizationDoc);

    res.status(200).json(newDocument);
  } catch (error) {
    next(error);
  }
};

export const deleteOrganization = async (req, res, next) => {
  const { orgId, userId } = req.body;
  console.log(userId);

  try {
    if (!orgId) {
      return res
        .status(400)
        .json({ message: "Organization ID cannot be empty" });
    }
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const findOrg = await Organization.findById(orgId);

    if (!findOrg) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Check if the userId matches the adminId
    const isAdmin = findOrg.admin.some(
      (admin) => admin.adminId.toString() === userId
    );

    if (!isAdmin) {
      return res.status(403).json({
        message: "You are not authorized to delete this organization",
      });
    }

    // Proceed with deletion if authorized
    await Organization.findByIdAndDelete(orgId);
    return res
      .status(200)
      .json({ message: "Organization deleted successfully" });
  } catch (error) {
    next(error);
  }
};
