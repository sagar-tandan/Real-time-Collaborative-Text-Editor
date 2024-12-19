import MyContext from "@/Context/MyContext";
import axios from "axios";
import {
  DeleteIcon,
  EllipsisVertical,
  ExternalLinkIcon,
  FileText,
  TrashIcon,
  Type,
} from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { parseISO, format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UserDocuments = () => {
  const naviagte = useNavigate();
  const { endPoint, token, user } = useContext(MyContext);
  const [isLoading, setLoading] = useState(false);
  const [allDocuments, setDocuments] = useState([]);

  useEffect(() => {
    if (user == null) return;

    const getAllUserDocuments = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${endPoint}/api/document/getUserDocument`,
          {
            userId: user?._id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response && response.status === 200) {
          setDocuments(response.data);
          console.log(response.data);
        } else {
          toast.error("Error fetching documents");
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
        toast.error("Error fetching documents");
        setLoading(false);
      }
    };

    getAllUserDocuments();
  }, [user]);

  const parseDate = (timestamp) => {
    const date = parseISO(timestamp);
    const formattedDate = format(date, "MMM dd, yyyy"); // Dec 18, 2024, for example
    return formattedDate;
  };

  return (
    <div className="max-w-screen-xl mx-auto px-16 py-6 flex flex-col gap-y-4">
      <div className="flex justify-between">
        <span className="font-medium">Recent Documents</span>
        <span className="font-medium">Owned by</span>
        <span className="font-medium">Last Updated</span>
        <span className="font-medium">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span>
      </div>
      <div className="w-full flex flex-col gap-y-2">
        {allDocuments?.map((document) => {
          const date = document.updatedAt;
          const finalDate = parseDate(date);

          return (
            <div
              onClick={() => {
                naviagte(`/document/${document.doc_id}`);
              }}
              className="w-full flex justify-between items-center rounded-full py-2 px-6 hover:bg-[#f1f3f4] transition-all duration-300 ease-in-out cursor-pointer"
            >
              <div className="flex gap-2 justify-center items-center">
                <FileText className="size-4 text-blue-600" />
                <span className="font-medium text-sm text-neutral-800">
                  {document.doc_title}
                </span>
              </div>

              <span className="text-sm text-neutral-800">
                {document.ownerName}
              </span>
              <span className="text-sm text-neutral-800">{finalDate}</span>
              <DropdownMenu>
                <DropdownMenuTrigger className="cursor-pointer">
                  <EllipsisVertical className="z-10 size-9 hover:bg-neutral-300/80 rounded-full p-2 text-neutral-800 transition-all ease-in-out duration-300" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Type className="size-4 cursor-pointer" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    {" "}
                    <TrashIcon className="size-4 cursor-pointer" />
                    Remove
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <ExternalLinkIcon className="size-4 cursor-pointer" />
                    Open in new Tab
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserDocuments;
