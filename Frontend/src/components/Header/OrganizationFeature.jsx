import React, { useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon, ChevronRightIcon, PlusIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

const OrganizationFeature = () => {
  const [newOrg, setOrganization] = useState({
    imageUrl: "",
    orgName: "",
    orgSlug: "",
  });

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
  };

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

            {/* CREATE ORGANIZATION */}
            <Dialog>
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
                          readOnly // Optional: Prevent manual editing of the slug field
                        />
                      </div>

                      <div className="w-full flex justify-end items-center">
                        <Button
                          type="submit"
                          className="px-2 py-[6px] bg-blue-600 hover:bg-blue-800 text-white rounded-sm transition-bg ease-in-out duration-150 active:scale-[97%]"
                        >
                          Create Organization
                        </Button>
                      </div>
                    </form>
                  </DialogDescription>
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
