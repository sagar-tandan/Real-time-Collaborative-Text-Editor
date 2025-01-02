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
import { Loader, MoreVertical } from "lucide-react";
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
  const [allAdmin, setAllAdmin] = useState([]);

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
        // setAllAdmin(response.data.admin);
        // console.log(allMembers, allAdmin);
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
            <TableHead>Joined</TableHead>
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
            {allMembers
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
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        )}
      </Table>

      <InviteDialog
        isNextDialogOpen={isNextDialogOpen}
        setIsNextDialogOpen={setIsNextDialogOpen}
      />
    </div>
  );
};

export default MemberSection;
