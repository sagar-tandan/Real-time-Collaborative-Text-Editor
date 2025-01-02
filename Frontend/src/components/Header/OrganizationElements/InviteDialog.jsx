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
import { useToast } from "@/hooks/use-toast";

const InviteDialog = ({ isNextDialogOpen, setIsNextDialogOpen }) => {
  const {
    user,
    token,
    endPoint,
    currentProfile,
    setCurrentProfile,
    userOrganization,
    setAllOrganization,
  } = useContext(MyContext);

  const { toast } = useToast();

  const [inviteEmails, setInviteEmails] = useState({
    email: [],
    role: "member",
  });
  const [isInviteSent, setInvite] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChangeEmailTextArea = (e) => {
    const { value } = e.target;
    setInviteEmails((prev) => ({
      ...prev,
      email: value,
    }));
  };

  const onChangeRoles = (value) => {
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
      orgName: currentProfile?.orgName,
    };

    try {
      // Send the data to the backend
      const response = await axios.post(
        `${endPoint}/api/organization/sendInvitation`,
        requestBody
      );
      if (response.status === 200) {
        console.log("Invitation sent successfully:", response.data);
      }
      setLoading(false);
      setInvite(true);
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast({
        description: error.response.data.message,
      });
      setLoading(false);
    }
  };

  return (
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
                  onClick={() => {
                    setIsNextDialogOpen(false);
                    setInvite(false);
                  }}
                  className="px-3 active:scale-[98%] bg-black text-white py-2 rounded-sm"
                >
                  Finish
                </button>
              </div>
            </DialogDescription>
          ) : (
            <DialogDescription className="w-full flex flex-col gap-4">
              <form onSubmit={onSubmitInvitation}>
                <Textarea
                  name="InviteEmail"
                  onChange={onChangeEmailTextArea}
                  placeholder="example1@gmail.com, example2@gmail.com"
                  className="w-full mt-3 p-2 text-black"
                  required
                />
                {/* Additional content goes here */}

                <div className="flex items-center gap-2 mt-3">
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

                <div className="w-full flex items-center justify-end pb-5 mt-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsNextDialogOpen(false);
                      }}
                      className="px-5 py-2 rounded-sm font-medium "
                    >
                      Skip
                    </button>
                    <button
                      type="submit"
                      className="px-3 active:scale-[98%] bg-black text-white py-2 rounded-sm"
                    >
                      {loading ? "Sending...." : "Send Invitation"}
                    </button>
                  </div>
                </div>
              </form>
            </DialogDescription>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default InviteDialog;
