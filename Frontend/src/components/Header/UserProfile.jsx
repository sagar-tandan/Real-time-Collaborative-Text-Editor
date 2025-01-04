import React, { useContext, useEffect, useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EditIcon, LogOutIcon, PenIcon, X } from "lucide-react";
import { PopoverClose } from "@radix-ui/react-popover";
import MyContext from "@/Context/MyContext";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { user, setUser, setToken, setCurrentProfile } = useContext(MyContext);
  const navigate = useNavigate();

  return (
    <div className="w-[100px] h-[42px] overflow-hidden flex justify-end font-inter">
      <Popover>
        <HoverCard>
          <HoverCardTrigger>
            <PopoverTrigger>
              <img
                className=" object-cover w-[40px] h-[40px] rounded-full cursor-pointer border-white hover:border-neutral-300/80 transition-all ease-in-out duration-300 border-[3px]"
                src="https://github.com/shadcn.png"
                alt="profile"
              />
            </PopoverTrigger>
          </HoverCardTrigger>
          <HoverCardContent className="bg-neutral-700/80 text-white mx-4 mt-1 flex flex-col p-2">
            <span className="font-medium">Doc Account</span>
            <span className="text-sm text-neutral-200">{user?.userEmail}</span>
            <span className="text-sm text-neutral-200">{user?.userName}</span>
          </HoverCardContent>
        </HoverCard>

        <PopoverContent className="flex flex-col items-center bg-blue-50 mx-4 min-w-[350px] z-10">
          <div className="w-full justify-between flex ">
            <span></span>
            <p className="text-center text-sm font-semibold">
              {user?.userEmail}
            </p>
            <PopoverClose>
              <X className="size-6 text-neutral-600 hover:text-neutral-800 cursor-pointer" />
            </PopoverClose>
          </div>
          <span className="text-neutral-500 text-[14px]">Personal Account</span>

          <div className="relative cursor-pointer">
            <img
              src="https://github.com/shadcn.png"
              alt="profile"
              className="w-[60px] h-[60px] rounded-full my-3 hover:opacity-90 transition-all duration-200 ease-in-out"
            />
            <div className="bg-white hover:text-blue-700 rounded-full flex items-center justify-center absolute p-1 bottom-2 right-0">
              <PenIcon className="size-[14px]" />
            </div>
          </div>
          <span className="text-center text-xl">Hi, {user?.userName} !</span>
          <div className="w-full mx-4 flex gap-2 mt-3">
            <button className=" py-3 px-4 rounded-l-full bg-white flex items-center gap-2 w-full hover:bg-neutral-300 transition-all ease-in-out duration-300">
              <EditIcon className="size-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("docsToken");
                localStorage.removeItem("userInfo");
                localStorage.removeItem("currentProfile");
                setToken("");
                setUser("");
                setCurrentProfile("");
                navigate("/");
              }}
              className=" py-3 px-4 rounded-r-full bg-white flex items-center gap-2 w-full hover:bg-neutral-300 transition-all ease-in-out duration-300"
            >
              <LogOutIcon className="size-4" />
              <span>Sign out</span>
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default UserProfile;
