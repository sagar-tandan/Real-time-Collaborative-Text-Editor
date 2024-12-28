import MyContext from "@/Context/MyContext";
import axios from "axios";
import { Loader } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { parseISO, format } from "date-fns";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import DocumentItem from "./DocumentItem";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "../ui/toast";

const UserDocuments = () => {
  const { endPoint, token, user, removeTrigger, updateTrigger } =
    useContext(MyContext);
  const [isLoading, setLoading] = useState(true); // Set initial loading to true
  const [allDocuments, setDocuments] = useState([]);
  const [error, setError] = useState(null);

  const { toast } = useToast();

  useEffect(() => {
    const getAllUserDocuments = async () => {
      if (!user?.userId) {
        setError("User or token not available");
        setLoading(false);
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
        // toast.error("Error fetching documents");
        toast({
          variant: "destructive",
          title: "Error fetching documents",
          description: "There was a problem while fetching the documents.",
          action: (
            <ToastAction
              onClick={() => window.location.reload()}
              altText="Try again"
            >
              Try again
            </ToastAction>
          ),
        });
      } finally {
        setLoading(false);
      }
    };

    getAllUserDocuments();
  }, [user?.userId, removeTrigger, updateTrigger]);

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
    <div className="max-w-screen-xl mx-auto px-16 py-6 flex flex-col gap-5 relative">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-none">
            <TableHead>Name</TableHead>
            <TableHead>&nbsp;</TableHead>
            <TableHead className="hidden md:table-cell">Shared</TableHead>
            <TableHead className="hidden md:table-cell">Created at</TableHead>
          </TableRow>
        </TableHeader>

        {allDocuments.length === 0 ? (
          <TableBody>
            <TableRow className="hover:bg-transparent">
              <TableCell colspan={4} className="h-24 text-center ">
                No document found
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody>
            {allDocuments.map((document) => (
              <DocumentItem key={document.doc_id} document={document} />
            ))}
          </TableBody>
        )}
      </Table>
    </div>
  );
};

export default UserDocuments;
