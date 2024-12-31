import React, { useContext, useState } from "react";
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
import MyContext from "@/Context/MyContext";
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

const OrgDialog = ({ children }) => {
  const [active, setActive] = useState("general");
  const [tabActive, setTabActive] = useState("tabMem");
  const { currentProfile } = useContext(MyContext);
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl p-0 ">
        <div className="w-full flex gap-x-2 h-[80vh]">
          <section className="w-[30%] bg-neutral-200/80 flex flex-col rounded-l-md p-4">
            <h1 className="font-medium text-lg">Organization</h1>
            <span className="text-sm text-neutral-500">
              Manage your organization
            </span>

            <div className="w-full flex flex-col gap-y-1 mt-5 ">
              <div
                onClick={() => setActive("general")}
                className={`flex gap-x-2 items-center w-full hover:bg-neutral-300/80 p-2 rounded-sm cursor-pointer transition-all ease-in-out duration-200 ${
                  active === "general" ? "bg-neutral-300/80" : "opacity-50"
                }`}
              >
                <GoOrganization className="size-4" />
                <span className="text-neutral-800 font-medium text-sm">
                  General
                </span>
              </div>

              <div
                onClick={() => {
                  setActive("members");
                }}
                className={`flex gap-x-2 items-center w-full hover:bg-neutral-300/80 p-2 rounded-sm cursor-pointer transition-all ease-in-out duration-200 ${
                  active === "members" ? "bg-neutral-300/80" : "opacity-50"
                }`}
              >
                <LuUsers className="size-4" />
                <span className="text-neutral-800 font-medium text-sm">
                  Members
                </span>
              </div>
            </div>
          </section>
          <section className="w-[70%] flex flex-col rounded-md p-2">
            {active === "general" && (
              <div className="w-full flex flex-col p-2 ">
                <h1 className="font-medium">General</h1>

                <Table className="mt-8 border-none ">
                  <TableRow>
                    <TableCell className="font-medium">
                      Organization Profile
                    </TableCell>
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
                    <TableCell className=" cursor-pointer">
                      Update Profile
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">
                      Leave Organization
                    </TableCell>
                    <TableCell className="font-medium text-red-600 cursor-pointer">
                      Leave Organization
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">
                      Delete Organization
                    </TableCell>
                    <TableCell className="font-medium text-red-600 cursor-pointer">
                      Delete Organization
                    </TableCell>
                  </TableRow>
                </Table>
                <form action=""></form>
              </div>
            )}

            {active === "members" && (
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
                    {tabActive === "tabInvite" && (
                      <hr className="border-black" />
                    )}
                  </div>
                </div>

                <div className="w-full flex justify-end mt-1">
                  <Button>Invite</Button>
                </div>

                <Table className="border border-gray-200 rounded-md mt-4">
                  <TableHeader>
                    <TableRow className="bg-gray-100">
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
                            <p className="text-sm text-gray-500">
                              {user.email}
                            </p>
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
              </div>
            )}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrgDialog;
