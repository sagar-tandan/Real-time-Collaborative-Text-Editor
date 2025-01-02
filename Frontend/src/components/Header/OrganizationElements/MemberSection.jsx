import React, { useState } from "react";
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
import { MoreVertical } from "lucide-react";
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
  const [tabActive, setTabActive] = useState("tabMem");
  const [isNextDialogOpen, setIsNextDialogOpen] = useState(false);

  return (
    <div className="w-full flex flex-col p-2 ">
      <h1 className="font-medium mb-6">Members</h1>
      <div className="w-full flex gap-x-4">
        <div
          onClick={() => setTabActive("tabMem")}
          className="flex flex-col gap-y-1 cursor-pointer text-sm"
        >
          <span className="flex gap-x-4 items-center justify-center px-2">
            <h1 className="font-medium">Members</h1>
            <span className=" text-neutral-600 font-medium">2</span>
          </span>
          {tabActive === "tabMem" && <hr className="border-black" />}
        </div>

        <div
          onClick={() => setTabActive("tabInvite")}
          className="flex flex-col gap-y-1 cursor-pointer text-sm"
        >
          <span className="flex gap-x-4 items-center justify-center px-2">
            <h1 className="font-medium">Invitations</h1>
            <span className=" text-neutral-600 font-medium">0</span>
          </span>
          {tabActive === "tabInvite" && <hr className="border-black" />}
        </div>
      </div>

      <div className="w-full flex justify-end mt-1">
        <Button onClick={() => setIsNextDialogOpen(true)}>Invite</Button>
      </div>

      <Table className=" mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="border-t">
              <TableCell className="flex items-center gap-3 p-4">
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </TableCell>
              <TableCell className="p-4">{user.joined}</TableCell>
              <TableCell className="p-4 flex items-center gap-2">
                <Select>
                  <SelectTrigger className="w-28">
                    <SelectValue placeholder={user.role} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Member">User</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
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
      </Table>

      <InviteDialog
        isNextDialogOpen={isNextDialogOpen}
        setIsNextDialogOpen={setIsNextDialogOpen}
      />
    </div>
  );
};

export default MemberSection;
