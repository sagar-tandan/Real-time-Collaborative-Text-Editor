import React, { useContext, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GoOrganization } from "react-icons/go";
import { Table, TableRow, TableCell } from "@/components/ui/table";
import MyContext from "@/Context/MyContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Loader } from "lucide-react";

const GeneralSection = ({ setIsMainDialogOpen }) => {
  const { toast } = useToast();
  const {
    currentProfile,
    endPoint,
    user,
    token,
    setCurrentProfile,
    setAllOrganization,
  } = useContext(MyContext);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isdeleting, setIsDeleting] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isLeaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [openUpdateDialog, setUpdateDialog] = useState(false);

  const [newOrg, setOrganization] = useState({
    orgName: currentProfile?.orgName,
    orgSlug: "",
  });

  const [isUpdating, setIsUpdating] = useState(false);

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/[^\w-]+/g, ""); // Remove non-word characters
  };

  const onOrgChange = (e) => {
    const { name, value } = e.target;
    setOrganization((prev) => {
      if (name === "orgName") {
        return {
          ...prev,
          orgName: value,
          orgSlug: generateSlug(value),
        };
      }
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentProfile?.role === "Admin") {
      await updateOrganization();
    } else {
      toast({
        variant: "destructive",
        description: "You are not authorized to update Organization",
      });
    }
  };

  const handleLeaveOrganization = () => {
    if (currentProfile?.role === "Admin") {
      toast({
        variant: "destructive",
        description: "Admins are not allowed to leave organization",
      });
    } else {
      setLeaveDialogOpen(true);
    }
  };

  const handleDeleteOrganization = () => {
    if (currentProfile?.role === "Admin") {
      setIsConfirmDialogOpen(true); // Open the confirmation dialog
    } else {
      toast({
        variant: "destructive",
        title: "Organization deletion",
        description: "You are not authorized to delete this organization",
      });
    }
  };

  const updateOrganization = async () => {
    setIsUpdating(true);
    try {
      const response = await axios.post(
        `${endPoint}/api/organization/update-organization`,
        {
          orgId: currentProfile.orgId,
          orgName: newOrg.orgName,
          orgSlug: newOrg.orgSlug,
          userId: user.userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast({
          description: "Organization successfully updated.",
        });

        const updatedData = {
          type: currentProfile.type,
          orgName: newOrg.orgName,
          orgId: currentProfile.orgId,
          role: currentProfile.role,
        };

        localStorage.setItem("currentProfile", JSON.stringify(updatedData));
        setCurrentProfile(updatedData);
        setUpdateDialog(false);
        setIsUpdating(false);
      }
    } catch (error) {
      console.log(error);
      toast({
        description: "Something went wrong",
      });
      setIsUpdating(false);
    }
  };

  const confirmLeave = async () => {
    setIsLeaving(true);
    try {
      const response = await axios.post(
        `${endPoint}/api/organization/leave-organization`,
        {
          orgId: currentProfile?.orgId,
          userId: user.userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast({
          description: "Successfully left the organization",
        });
      }
      setLeaveDialogOpen(false);
      setIsMainDialogOpen(false);
      setIsLeaving(false);
      localStorage.removeItem("currentProfile");
      setCurrentProfile("");
      fetchOrganization();
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        description: "Something went Wrong!!!",
      });
      setIsLeaving(false);
    }
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.post(
        `${endPoint}/api/organization/delete-organization`,
        {
          orgId: currentProfile?.orgId,
          userId: user.userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast({
          title: "Organization deletion",
          description: "Organization deleted successfully",
        });
      }
      setIsConfirmDialogOpen(false);
      setIsMainDialogOpen(false);
      setIsDeleting(false);
      localStorage.removeItem("currentProfile");
      setCurrentProfile("");
      fetchOrganization();
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        description: "Something went Wrong!!!",
      });
      setIsDeleting(false);
    }
  };

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

  return (
    <>
      <div className="w-full flex flex-col p-2 ">
        <h1 className="font-medium">General</h1>

        <Table className="mt-8 border-none ">
          <TableRow>
            <TableCell className="font-medium">Organization Profile</TableCell>
            <TableCell className="flex gap-x-2 items-center">
              {currentProfile?.logo ? (
                <img
                  className="w-[30px] h-[30px] rounded-full "
                  src={currentProfile.logo}
                  alt=""
                />
              ) : (
                <div className="w-[30px] flex items-center justify-center p-1 bg-blue-700 rounded-sm">
                  <GoOrganization className="size-5 text-white" />
                </div>
              )}

              {currentProfile?.orgName}
            </TableCell>
            <TableCell
              onClick={() => setUpdateDialog(true)}
              className=" cursor-pointer"
            >
              Update Profile
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="font-medium">Leave Organization</TableCell>
            <TableCell
              onClick={handleLeaveOrganization}
              className="font-medium text-red-600 cursor-pointer"
            >
              Leave Organization
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="font-medium">Delete Organization</TableCell>
            <TableCell
              onClick={handleDeleteOrganization}
              className="font-medium text-red-600 cursor-pointer"
            >
              Delete Organization
            </TableCell>
          </TableRow>
        </Table>
        <form action=""></form>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Organization</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the organization? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              {isdeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={isLeaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave Organization</DialogTitle>
            <DialogDescription>
              Are you sure you want to leave the organization? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setLeaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmLeave}>
              {isLeaving ? "Leaving..." : "Leave"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Organization Name */}
      <Dialog open={openUpdateDialog} onOpenChange={setUpdateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Organization</DialogTitle>
            <DialogDescription>
              <form
                onSubmit={handleSubmit}
                className="w-full flex flex-col gap-4 "
              >
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
                    disabled={isUpdating}
                    type="submit"
                    className="mt-4 p-2 bg-blue-500 text-white rounded-sm hover:bg-blue-700 w-[150px] flex items-center justify-center"
                  >
                    {isUpdating ? (
                      <Loader className="animate-spin" />
                    ) : (
                      "Update Organization"
                    )}
                  </button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GeneralSection;
