import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useContext, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import MyContext from "@/Context/MyContext";

const RenameDialog = ({ docId, initialTitle, children }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [title, setTitle] = useState(initialTitle); // Initialize with initialTitle
  const [open, setOpen] = useState(false);
  const { token, endPoint, setUpdateTrigger } = useContext(MyContext);

  // Update title when initialTitle prop changes
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
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setUpdateTrigger((prev) => !prev); // Toggle to trigger update
        console.log("Document renamed successfully:", response.data);
      }
    } catch (error) {
      console.error("Error renaming document:", error);
    }
  };

  const handleChange = (e) => {
    e.stopPropagation();
    setTitle(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!title?.trim()) {
      return; // Don't submit if title is empty
    }

    setIsUpdating(true);
    await updateDocumentName();
    setIsUpdating(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Rename Document</DialogTitle>
            <DialogDescription>
              Enter a new name for this document
            </DialogDescription>
          </DialogHeader>
          <div className="my-4">
            <Input
              value={title || ""} // Handle undefined/null case
              onChange={handleChange}
              onClick={(e) => e.stopPropagation()}
              placeholder="Document name"
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              disabled={isUpdating}
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RenameDialog;
