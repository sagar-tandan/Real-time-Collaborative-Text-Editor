import React, { useContext, useEffect, useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Building2Icon,
  BuildingIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  LayoutGrid,
  MailIcon,
  PlusIcon,
} from "lucide-react";

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

const OrganizationFeature = () => {
  const { user, token, endPoint } = useContext(MyContext);
  const [userOrganization, setAllOrganization] = useState([]);
  const [newOrg, setOrganization] = useState({
    imageUrl: "",
    orgName: "",
    orgSlug: "",
  });

  const [isCreateOrgDialogOpen, setIsCreateOrgDialogOpen] = useState(false); // Manage "Create Organization" dialog
  const [isNextDialogOpen, setIsNextDialogOpen] = useState(false); // Manage the second dialog

  const [isInviteSent, setInvite] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(newOrg);
    setIsCreateOrgDialogOpen(false); // Close the current dialog
    setIsNextDialogOpen(true); // Open the next dialog
  };

  useEffect(() => {
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
          setAllOrganization(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchOrganization();
  }, [user, token]);

  return (
    <div className="flex rounded-sm w-[190px] absolute right-[50px] top-0">
      <Popover>
        <PopoverTrigger className="w-full flex rounded-sm items-center hover:bg-blue-50 p-1 gap-x-1 transition-all ease-in-out duration-300">
          <img
            className="w-[36px] h-[36px] rounded-full"
            src="https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/11_avatar-512.png"
            alt=""
          />
          <span className="text-sm text-neutral-600 font-medium">
            Personal Account
          </span>
          <ChevronDownIcon className="size-4 text-neutral-700" />
        </PopoverTrigger>
        <PopoverContent>
          <div className="w-full bg-white rounded-sm p-2 flex flex-col gap-1">
            <div className="w-full flex rounded-sm items-center gap-x-1 ">
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
              userOrganization.map((org) => (
                <div className="w-full flex rounded-sm items-center gap-x-1 my-2">
                  {/* <div className="bg-black rounded-sm flex items-center justify-center"> */}
                  {org.imageUrl ? (
                    <img
                      className="w-[36px] h-[36px] rounded-full "
                      src="https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/11_avatar-512.png"
                      alt=""
                    />
                  ) : (
                    <div className="w-[38px] flex items-center justify-center p-1">
                      <Building2Icon className="size-8 text-blue-500" />
                    </div>
                  )}

                  {/* </div> */}
                  <div className="flex justify-between items-center w-[80%] cursor-pointer pl-2">
                    <span className="text-sm text-neutral-600 font-medium">
                      {org.organizationName}
                    </span>
                    <ChevronRightIcon className="size-4 text-neutral-700" />
                  </div>
                </div>
              ))}

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
                    <span className="text-sm text-neutral-600 font-medium">
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
                          type="submit"
                          className="mt-4 p-2 bg-blue-500 text-white rounded-sm hover:bg-blue-700"
                        >
                          Create Organization
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
                        placeholder="example1@gmail.com, example2@gmail.com"
                        className="w-full mt-3 p-2 text-black"
                        required
                      />
                      {/* Additional content goes here */}

                      <div className="flex items-center gap-2">
                        <span className="font-medium pl-1">Role : </span>
                        <Select>
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
                            onClick={() => setIsNextDialogOpen(false)}
                            className="px-5 py-2 rounded-sm font-medium "
                          >
                            Skip
                          </button>
                          <button
                            onClick={() => setInvite(true)}
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
