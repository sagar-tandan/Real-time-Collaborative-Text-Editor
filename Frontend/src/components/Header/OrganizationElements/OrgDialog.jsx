import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { GoOrganization } from "react-icons/go";
import { LuUsers } from "react-icons/lu";
import GeneralSection from "./GeneralSection.jsx";
import MemberSection from "./MemberSection.jsx";

const OrgDialog = ({ children }) => {
  const [active, setActive] = useState("general");
  const [isMainDialogOpen, setIsMainDialogOpen] = useState(false);

  return (
    <>
      <Dialog open={isMainDialogOpen} onOpenChange={setIsMainDialogOpen}>
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
                <GeneralSection setIsMainDialogOpen={setIsMainDialogOpen} />
              )}

              {active === "members" && <MemberSection />}
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrgDialog;
