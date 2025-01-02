import React, { useContext, useEffect, useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  Loader,
  MailIcon,
  PlusIcon,
  SettingsIcon,
} from "lucide-react";
import { GoOrganization } from "react-icons/go";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MyContext from "@/Context/MyContext";
import axios from "axios";
import OrgDialog from "./OrganizationElements/OrgDialog";

const OrganizationFeature = () => {
  const {
    user,
    token,
    endPoint,
    currentProfile,
    setCurrentProfile,
    userOrganization,
    setAllOrganization,
  } = useContext(MyContext);
  const [newOrg, setOrganization] = useState({
    imageUrl: "",
    orgName: "",
    orgSlug: "",
  });

  const [openPopover, setOpenPopover] = useState(false);

  const [isCreateOrgDialogOpen, setIsCreateOrgDialogOpen] = useState(false); // Manage "Create Organization" dialog
  const [isNextDialogOpen, setIsNextDialogOpen] = useState(false); // Manage the second dialog
  const [inviteEmails, setInviteEmails] = useState({
    email: [],
    role: "member",
  });
  const [isInviteSent, setInvite] = useState(false);

  // to upload images to Cloudinary
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cloudinary configuration
  const cloudName = "djpnst0u5";
  const uploadPreset = "realtimeTextEditor";

  const fetchOrganization = async () => {
    try {
      const response = await axios.get(
        `${endPoint}/api/organization/getOrganization`,
        {
          params: { userId: user?.userId },
          headers: {
            Authorization: `Bearer ${token}`, // Authorization header
          },
        }
      );

      if (response.status === 201) {
        // console.log(response.data);
        setAllOrganization(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Function to generate slug from orgName
  const generateSlug = (name) => {
    return name
      .toLowerCase() // Convert to lowercase
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/[^\w-]+/g, ""); // Remove non-word characters
  };

  const onOrgChange = (e) => {
    const { name, value } = e.target; // Get the name and value from the input
    setOrganization((prev) => {
      if (name === "orgName") {
        // If the orgName field changes, also update the orgSlug
        return {
          ...prev,
          orgName: value,
          orgSlug: generateSlug(value), // Generate the slug based on orgName
        };
      }
      return {
        ...prev,
        [name]: value, // Update other fields if needed (like orgSlug)
      };
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    console.log(file);
    if (file) {
      setImage(file); // Set the selected image file
    }
  };

  const uploadImageToCloudinary = async () => {
    if (!image) {
      return;
    }
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );

      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      setLoading(false);
    }
  };

  const createOrganization = async () => {
    setLoading(true);
    try {
      const imageUrl = await uploadImageToCloudinary();
      console.log(imageUrl);
      const response = await axios.post(
        `${endPoint}/api/organization/createOrganization`,
        {
          orgName: newOrg.orgName,
          createdBy: user?.userId,
          imageUrl: imageUrl,
          orgSlug: newOrg.orgSlug,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Authorization header
          },
        }
      );

      if (response.status === 200) {
        setLoading(false);
        fetchOrganization();
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createOrganization();
    setIsCreateOrgDialogOpen(false);
    setIsNextDialogOpen(true);
    setInvite(false);
  };

  // For now update for 1 email only
  const onChangeEmailTextArea = (e) => {
    const { value } = e.target;
    setInviteEmails((prev) => ({
      ...prev,
      email: value,
    }));
  };

  const onChangeRoles = (value) => {
    // console.log(value);
    setInviteEmails((prev) => ({
      ...prev,
      role: value,
    }));
  };

  // Handle form submission
  const onSubmitInvitation = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Split the input by commas and trim spaces to create an array of emails
    const emailArray = inviteEmails.email
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email); // Remove any empty values from the array

    // Create the request body
    const requestBody = {
      email: emailArray,
      role: inviteEmails.role,
      orgName: newOrg.orgName,
    };

    try {
      // Send the data to the backend
      const response = await axios.post(
        `${endPoint}/api/organization/sendInvitation`,
        requestBody
      );
      if (response.status === 200) {
        console.log("Invitation sent successfully:", response.data);
      } else {
        // console.log(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error sending invitation:", error);
      setLoading(false);
    }

    setOrganization({
      imageUrl: "",
      orgName: "",
      orgSlug: "",
    });
    setInvite(true);
    setLoading(false);
  };

  const joinOrganization = async (org) => {
    setLoading(true);
    const requestBody = {
      orgId: org._id,
      userId: user?.userId,
    };

    try {
      const response = await axios.post(
        `${endPoint}/api/organization/joinOrganization`,
        requestBody
      );

      if (response.status === 200) {
        await fetchOrganization();
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganization();
  }, [user, token]);

  const switchAccounts = (org) => {
    const isAdmin = org.admin.some((admin) => admin.adminId === user?.userId);

    setCurrentProfile({
      type: "Organization",
      orgName: org.organizationName,
      logo: org.logo,
      orgId: org._id,
      role: isAdmin ? "Admin" : "Member",
    });

    localStorage.setItem(
      "currentProfile",
      JSON.stringify({
        type: "Organization",
        orgName: org.organizationName,
        logo: org.logo,
        orgId: org._id,
        role: isAdmin ? "Admin" : "Member",
      })
    );

    setOpenPopover(false);
  };

  return (
    <div className="flex rounded-sm w-[190px] absolute right-[50px] top-0">
      <Popover open={openPopover} onOpenChange={setOpenPopover}>
        <PopoverTrigger className="w-full flex justify-between rounded-sm items-center hover:bg-blue-50 p-1 gap-x-1 transition-all ease-in-out duration-300">
          <div className="flex gap-x-2 items-center justify-center">
            {currentProfile?.type === "Organization" ? (
              <>
                {currentProfile.logo ? (
                  <img
                    className="w-[36px] h-[36px] rounded-full"
                    src={currentProfile.logo}
                    alt=""
                  />
                ) : (
                  <div className="w-[32px] flex items-center justify-center p-1 bg-blue-700 rounded-sm">
                    <GoOrganization className="size-6 text-white" />
                  </div>
                )}

                <span className="text-sm text-neutral-600 font-medium">
                  {currentProfile.orgName}
                </span>
              </>
            ) : (
              <>
                <img
                  className="w-[36px] h-[36px] rounded-full"
                  src="https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/11_avatar-512.png"
                  alt=""
                />
                <span className="text-sm text-neutral-600 font-medium truncate">
                  Personal Account
                </span>
              </>
            )}
          </div>

          <ChevronDownIcon className="size-4 text-neutral-700" />
        </PopoverTrigger>
        <PopoverContent>
          <div className="w-full bg-white rounded-sm p-2 flex flex-col gap-1 ">
            {currentProfile && currentProfile.type === "Organization" && (
              <div className="flex flex-col gap-y-1 mb-4">
                <div className="flex justify-between items-center cursor-pointer ">
                  <div className="flex gap-x-2 items-center justify-center ">
                    {currentProfile.logo ? (
                      <img
                        className="w-[36px] h-[36px] rounded-full "
                        src={currentProfile.logo}
                        alt=""
                      />
                    ) : (
                      <div className="w-[36px] flex items-center justify-center p-1 bg-blue-700 rounded-sm">
                        <GoOrganization className="size-7 text-white" />
                      </div>
                    )}
                    <div className="text-sm flex flex-col">
                      <span className="text-sm text-neutral-600 font-medium">
                        {currentProfile.orgName}
                      </span>
                      <span className="text-sm text-neutral-600 ">
                        {currentProfile.role}
                      </span>
                    </div>
                  </div>

                  <OrgDialog>
                    <span className="flex text-neutral-700">
                      <SettingsIcon className="size-4" />
                    </span>
                  </OrgDialog>
                </div>
              </div>
            )}

            <div
              onClick={() => {
                localStorage.removeItem("currentProfile");
                setCurrentProfile(null);
                setOpenPopover(false);
              }}
              className="w-full flex rounded-sm items-center gap-x-1 "
            >
              <div className="bg-black rounded-sm flex items-center justify-center">
                <img
                  className="w-[36px] h-[36px] rounded-full "
                  src="https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/11_avatar-512.png"
                  alt=""
                />
              </div>
              <div className="flex justify-between items-center w-[80%] cursor-pointer pl-2">
                <span className="text-sm text-neutral-600 font-medium">
                  Personal Account
                </span>
                <ChevronRightIcon className="size-4 text-neutral-700" />
              </div>
            </div>

            {userOrganization &&
              userOrganization
                .filter((org) => org._id !== currentProfile?.orgId)
                .map((org) => {
                  const isAcceptedMember = org.members.some(
                    (member) =>
                      member.userId === user.userId &&
                      member.memberStatus === "accepted"
                  );
                  return (
                    <div
                      onClick={() =>
                        isAcceptedMember ? switchAccounts(org) : null
                      }
                      className="w-full flex rounded-sm items-center gap-x-1 my-2"
                    >
                      {/* <div className="bg-black rounded-sm flex items-center justify-center"> */}
                      {org.logo ? (
                        <img
                          className="w-[36px] h-[36px] rounded-full "
                          src={org.logo}
                          alt=""
                        />
                      ) : (
                        <div className="w-[36px] flex items-center justify-center p-1 bg-blue-700 rounded-sm">
                          <GoOrganization className="size-7 text-white" />
                        </div>
                      )}

                      {/* </div> */}
                      <div className="flex justify-between items-center w-[80%] cursor-pointer pl-2">
                        <span className="text-sm text-neutral-600 font-medium">
                          {org.organizationName}
                        </span>

                        {isAcceptedMember ? (
                          <ChevronRightIcon className="size-4 text-neutral-700" />
                        ) : (
                          <button
                            onClick={() => joinOrganization(org)}
                            className="px-3 py-1 border-[1px] border-black rounded-sm"
                          >
                            {loading ? (
                              <Loader className="animate-spin" />
                            ) : (
                              "Join"
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

            {/* CREATE ORGANIZATION */}
            <Dialog
              open={isCreateOrgDialogOpen}
              onOpenChange={setIsCreateOrgDialogOpen}
            >
              <DialogTrigger>
                <div className="w-full flex rounded-sm items-center gap-x-1 mt-5 pl-1 cursor-pointer">
                  <div className="flex items-center justify-center w-[32px] h-[32px] border-neutral-500 border-[1px] rounded-full border-dashed bg-blue-50">
                    <PlusIcon className="size-4" />
                  </div>
                  <div className="flex justify-between items-center w-[80%] cursor-pointer pl-2">
                    <span
                      onClick={createOrganization}
                      className="text-sm text-neutral-600 font-medium"
                    >
                      Create Organization
                    </span>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Organization</DialogTitle>
                  <DialogDescription>
                    <form
                      onSubmit={handleSubmit}
                      className="w-full flex flex-col gap-4 "
                    >
                      <div className="w-full flex flex-col">
                        <span>Logo</span>
                        {/* Upload logo */}
                        <input
                          className="mt-2"
                          type="file"
                          onChange={handleImageChange}
                        />
                      </div>
                      <div className="flex flex-col w-full gap-2">
                        <span>Name</span>
                        <input
                          name="orgName"
                          className="w-full p-2 border-[1px] border-neutral-500 rounded-sm outline-neutral-700 text-black"
                          value={newOrg.orgName}
                          placeholder="Enter the name of Organization"
                          onChange={onOrgChange}
                          type="text"
                          required
                        />
                      </div>
                      <div className="flex flex-col w-full gap-2">
                        <span>Slug</span>
                        <input
                          name="orgSlug"
                          className="w-full p-2 border-[1px] border-neutral-500 rounded-sm outline-neutral-700 text-black"
                          value={newOrg.orgSlug}
                          readOnly
                        />
                      </div>

                      <div className="w-full flex justify-end items-center">
                        {/* Button to open the next dialog */}
                        <button
                          disabled={loading}
                          type="submit"
                          className="mt-4 p-2 bg-blue-500 text-white rounded-sm hover:bg-blue-700 w-[150px] flex items-center justify-center"
                        >
                          {loading ? (
                            <Loader className="animate-spin" />
                          ) : (
                            "Create Organization"
                          )}
                        </button>
                      </div>
                    </form>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>

            {/* Next Dialog */}
            <Dialog open={isNextDialogOpen} onOpenChange={setIsNextDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite New Members</DialogTitle>
                  {isInviteSent ? (
                    <DialogDescription className="w-full flex flex-col gap-4">
                      <div className="w-full flex flex-col gap-y-2 justify-center items-center mt-8">
                        <MailIcon className="size-8" />
                        <span>Invitation successfully sent</span>
                      </div>
                      <div className="w-full flex items-center justify-end pb-5">
                        <button
                          onClick={() => setIsNextDialogOpen(false)}
                          className="px-3 active:scale-[98%] bg-blue-500 text-white py-2 rounded-sm"
                        >
                          Finish
                        </button>
                      </div>
                    </DialogDescription>
                  ) : (
                    <DialogDescription className="w-full flex flex-col gap-4">
                      <Textarea
                        name="InviteEmail"
                        onChange={onChangeEmailTextArea}
                        placeholder="example1@gmail.com, example2@gmail.com"
                        className="w-full mt-3 p-2 text-black"
                        required
                      />
                      {/* Additional content goes here */}

                      <div className="flex items-center gap-2">
                        <span className="font-medium pl-1">Role : </span>
                        <Select onValueChange={onChangeRoles}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Member" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="w-full flex items-center justify-end pb-5">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setIsNextDialogOpen(false);
                              setOrganization({
                                imageUrl: "",
                                orgName: "",
                                orgSlug: "",
                              });
                            }}
                            className="px-5 py-2 rounded-sm font-medium "
                          >
                            Skip
                          </button>
                          <button
                            onClick={onSubmitInvitation}
                            className="px-3 active:scale-[98%] bg-blue-500 text-white py-2 rounded-sm"
                          >
                            Send Invitation
                          </button>
                        </div>
                      </div>
                    </DialogDescription>
                  )}
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default OrganizationFeature;
