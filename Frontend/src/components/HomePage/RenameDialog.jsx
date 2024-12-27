import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import React, { useContext, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import MyContext from "@/Context/MyContext";

const RenameDialog = ({ docId, initialTitle, children }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [title, setTitle] = useState();
  const [open, setOpen] = useState(false);
  const { token, endPoint, setUpdateTrigger } = useContext(MyContext);

  useEffect(() => {
    setTitle(initialTitle);
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
        setUpdateTrigger(true);
        console.log(response);
      }
    } catch (error) {
      console.error("Error renaming document:", error);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsUpdating(true);
    await updateDocumentName();
    setIsUpdating(false);
    setUpdateTrigger(true);
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
                console.log("hello i am save");
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
