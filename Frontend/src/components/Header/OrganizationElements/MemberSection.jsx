import React, { useContext, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GoOrganization } from "react-icons/go";
import { LuUsers } from "react-icons/lu";
import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableHeader,
  TableBody,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Delete,
  DeleteIcon,
  Loader,
  MoreVertical,
  TrashIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import InviteDialog from "./InviteDialog";
import axios from "axios";
import MyContext from "@/Context/MyContext";
import { useToast } from "@/hooks/use-toast";

const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    joined: "2024-01-01",
    role: "Admin",
    image: "/avatar1.jpg",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    joined: "2024-02-15",
    role: "User",
    image: "/avatar2.jpg",
  },
];
const MemberSection = () => {
  const { endPoint, currentProfile, token, user } = useContext(MyContext);
  const [isNextDialogOpen, setIsNextDialogOpen] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [allMembers, setAllMembers] = useState([]);
  const [deleteMember, setDeleteMember] = useState();
  const [editMember, setEditMember] = useState();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const fetchMembers = async () => {
    setisLoading(true);

    try {
      const response = await axios.get(
        `${endPoint}/api/organization/fetch-organization-members`,
        {
          params: { orgId: currentProfile.orgId }, // Ensure orgId is passed correctly
          headers: {
            Authorization: `Bearer ${token}`, // Include authorization token
          },
        }
      );

      if (response.status === 200) {
        setAllMembers(response.data.users);
        console.log(response.data);

        setisLoading(false);
      } else {
        // Log if the response status is not 200
        console.error("Failed to fetch members. Status:", response.status);
        setisLoading(false);
      }
    } catch (error) {
      // Enhanced error logging
      console.error(
        "Error fetching organization members:",
        error.response?.data || error.message
      );
      setisLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.post(
        `${endPoint}/api/organization/delete-organization-Member`,
        { userId: deleteMember.userId, orgId: currentProfile?.orgId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast({
          description: "User deleted successfully!!",
        });
        setIsDeleting(false);
        setIsConfirmDialogOpen(false);
        fetchMembers();
      }
    } catch (error) {
      console.log(error);
      toast({
        description: "Something went wrong!",
      });
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full flex flex-col p-2 ">
      <h1 className="font-medium mb-4">Members</h1>
      <div className="w-full flex justify-end mt-1 ">
        <Button className="px-4" onClick={() => setIsNextDialogOpen(true)}>
          Invite
        </Button>
      </div>

      <Table className=" mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        {isLoading ? (
          <TableBody>
            <TableRow>
              <TableCell className="w-full flex items-center justify-center">
                <Loader className="size-5 animate-spin" />
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody>
            {allMembers?.filter((member) => member.userId != user.userId)
              .length > 0 ? (
              allMembers
                ?.filter((member) => member.userId != user.userId)
                .map((member) => (
                  <TableRow key={member.userId} className="border-t">
                    <TableCell className="flex items-center gap-3 p-4">
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="p-4">{member.status}</TableCell>
                    <TableCell className="p-4 ">{member.role}</TableCell>
                    <TableCell>
                      {currentProfile?.role === "Admin" && (
                        <TrashIcon
                          onClick={() => {
                            setIsConfirmDialogOpen(true);
                            setDeleteMember(member);
                          }}
                          className="size-4 cursor-pointer text-red-600"
                        />
                        // <DropdownMenu>
                        //   <DropdownMenuTrigger>
                        //     <MoreVertical className="size-4" />
                        //   </DropdownMenuTrigger>
                        //   <DropdownMenuContent>
                        //     <DropdownMenuItem
                        //       onClick={() => {
                        //         setIsConfirmDialogOpen(true);
                        //         setDeleteMember(member);
                        //       }}
                        //     >
                        //       Delete
                        //     </DropdownMenuItem>
                        //   </DropdownMenuContent>
                        // </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell>No user Data</TableCell>
                </TableRow>
              </TableBody>
            )}
          </TableBody>
        )}
      </Table>

      {/* Confirmation Dialog Delete */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete members</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove the member? This action cannot be
              undone.
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
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <InviteDialog
        isNextDialogOpen={isNextDialogOpen}
        setIsNextDialogOpen={setIsNextDialogOpen}
        fetchMembers={fetchMembers}
      />
    </div>
  );
};

export default MemberSection;
