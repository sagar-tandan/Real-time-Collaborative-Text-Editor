import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import MyContext from "@/Context/MyContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const RenameDialog = ({ docId, initialTitle, onClose }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const { token, endPoint, setUpdateTrigger, user } = useContext(MyContext);

  const { toast } = useToast();

  useEffect(() => {
    if (initialTitle) {
      setTitle(initialTitle);
    }
  }, [initialTitle]);

  const updateDocumentName = async () => {
    try {
      const response = await axios.post(
        `${endPoint}/api/document/updateDocument`,
        {
          docId,
          documentName: title,
          userId: user.userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setUpdateTrigger((prev) => !prev);
        toast({
          description: "Document renamed successfully",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: error.response.data.message,
      });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!title?.trim()) {
      return;
    }

    setIsUpdating(true);
    await updateDocumentName();
    setIsUpdating(false);
    onClose();
  };

  const handleContainerClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-40 cursor-default"
      onClick={handleContainerClick}
    >
      <div className="fixed inset-0 bg-black bg-opacity-60" onClick={onClose} />
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-xl mx-4 overflow-hidden relative cursor-default"
        onClick={handleContainerClick}
      >
        <form onSubmit={onSubmit} onClick={handleContainerClick}>
          <div className="w-full flex justify-between">
            <div className="px-6 pt-4 flex flex-col">
              <h3 className="font-semibold text-lg text-gray-900">
                Rename Document
              </h3>
              <span className="text-neutral-600">
                Enter a new name for this document
              </span>
            </div>

            <X onClick={onClose} className="size-5 mt-4 mr-6 cursor-pointer" />
          </div>

          <div className="p-6">
            <Input
              type="text"
              value={title}
              onChange={(e) => {
                e.stopPropagation();
                setTitle(e.target.value);
              }}
              onClick={(e) => e.stopPropagation()}
              placeholder="Enter document title"
              autoFocus
            />
          </div>

          <div
            className="px-6 pb-4 flex justify-end space-x-3"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              type="button"
              variant="ghost"
              disabled={isUpdating}
              onClick={onClose}
              className="border-[1px]"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RenameDialog;
