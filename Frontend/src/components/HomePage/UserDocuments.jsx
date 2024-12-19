import MyContext from "@/Context/MyContext";
import axios from "axios";
import {
  EllipsisVertical,
  ExternalLinkIcon,
  FileText,
  TrashIcon,
  Type,
  Loader,
} from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { parseISO, format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UserDocuments = () => {
  const navigate = useNavigate();
  const { endPoint, token, user } = useContext(MyContext);
  const [isLoading, setLoading] = useState(true); // Set initial loading to true
  const [allDocuments, setDocuments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // const timeoutId = setTimeout(() => {
    const getAllUserDocuments = async () => {
      if (!user?.userId) {
        setError("User or token not available");
        setLoading(false);
        // setRefreshKey((prevKey) => prevKey + 1); // This will trigger component reload
        return;
      }

      try {
        const response = await axios.post(
          `${endPoint}/api/document/getUserDocument`,
          { userId: user.userId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response?.data) {
          setDocuments(response.data);
        } else {
          throw new Error("No data received");
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
        setError(error.response?.data?.message || "Error fetching documents");
        toast.error("Error fetching documents");
      } finally {
        setLoading(false);
      }
    };

    getAllUserDocuments();
    // }, 1000);

    // return () => clearTimeout(timeoutId);
  }, [user?.userId]);

  const parseDate = (timestamp) => {
    const date = parseISO(timestamp);
    return format(date, "MMM dd, yyyy");
  };

  if (isLoading) {
    return (
      <div className="max-w-screen-xl mx-auto px-16 py-6 h-[50vh] flex items-center justify-center">
        <Loader className="size-8 text-neutral-700 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-screen-xl mx-auto px-16 py-6 flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-16 py-6 flex flex-col gap-y-4">
      <div className="flex justify-between">
        <span className="font-medium">Recent Documents</span>
        <span className="font-medium">Owned by</span>
        <span className="font-medium">Last Updated</span>
        <span className="font-medium w-16"></span>
      </div>
      <div className="w-full flex flex-col gap-y-2">
        {allDocuments.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No documents found
          </div>
        ) : (
          allDocuments.map((document) => (
            <div
              key={document.doc_id}
              onClick={() => navigate(`/document/${document.doc_id}`)}
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
              <span className="text-sm text-neutral-800">
                {parseDate(document.updatedAt)}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger
                  onClick={(e) => e.stopPropagation()}
                  className="cursor-pointer"
                >
                  <EllipsisVertical className="z-10 size-9 hover:bg-neutral-300/80 rounded-full p-2 text-neutral-800 transition-all ease-in-out duration-300" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                    <Type className="size-4 mr-2" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                    <TrashIcon className="size-4 mr-2" />
                    Remove
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                    <ExternalLinkIcon className="size-4 mr-2" />
                    Open in new Tab
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserDocuments;
