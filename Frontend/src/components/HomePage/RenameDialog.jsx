import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import MyContext from "@/Context/MyContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const RenameDialog = ({ docId, initialTitle, children }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const { token, endPoint, setUpdateTrigger, setOpenRenameDialog, user } =
    useContext(MyContext);

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
        // console.log("Document renamed successfully:", response.data);
        toast({
          description: "Document renamed successfully",
        });
      }
    } catch (error) {
      // console.error("Error renaming document:", error);
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
    setOpenRenameDialog(false);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenRenameDialog(false);
  };

  // Handler for the outer container
  const handleContainerClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handler for the dialog box
  const handleDialogClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handler for the form
  const handleFormClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-40 cursor-default"
      onClick={handleContainerClick}
      onMouseDown={handleContainerClick}
      onMouseUp={handleContainerClick}
    >
      <div
        className="fixed inset-0 bg-black bg-opacity-60"
        onClick={handleContainerClick}
        onMouseDown={handleContainerClick}
        onMouseUp={handleContainerClick}
      />
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-xl mx-4 overflow-hidden relative cursor-default"
        onClick={handleDialogClick}
        onMouseDown={handleDialogClick}
        onMouseUp={handleDialogClick}
      >
        <form
          onSubmit={onSubmit}
          onClick={handleFormClick}
          onMouseDown={handleFormClick}
          onMouseUp={handleFormClick}
        >
          <div className="w-full flex justify-between">
            <div className="px-6 pt-4 flex flex-col">
              <h3 className="font-semibold text-lg text-gray-900">
                Rename Document
              </h3>
              <span className=" text-neutral-600">
                Enter a new name for this document
              </span>
            </div>

            <X
              onClick={() => setOpenRenameDialog(false)}
              className="size-5 mt-4 mr-6 cursor-pointer"
            />
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
              onMouseDown={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}
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
              onClick={handleCancel}
              onMouseDown={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}
              className="border-[1px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUpdating}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}
            >
              {isUpdating ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RenameDialog;
