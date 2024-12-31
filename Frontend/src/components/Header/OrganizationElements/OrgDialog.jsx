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
import { Table, TableRow, TableCell } from "@/components/ui/table";
import MyContext from "@/Context/MyContext";

const OrgDialog = ({ children }) => {
  const [active, setActive] = useState("general");
  const { currentProfile } = useContext(MyContext);
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl p-0 ">
        {/* <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader> */}
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
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrgDialog;
