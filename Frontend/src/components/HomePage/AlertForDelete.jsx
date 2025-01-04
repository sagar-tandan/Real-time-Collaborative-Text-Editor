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
import MyContext from "@/Context/MyContext";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AlertForDelete = ({ docId, children }) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const { endPoint, token, setRemoveTrigger, user } = useContext(MyContext);
  const { toast } = useToast();
  const navigate = useNavigate();

  const deleteDocument = async () => {
    try {
      const resposne = await axios.post(
        `${endPoint}/api/document/deleteDocument`,
        { docId: docId, userId: user.userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (resposne.status === 200) {
        toast({
          description: "Document deleted Successfully",
        });
        navigate("/");
      }
    } catch (error) {
      // console.log(error);
      toast({
        variant: "destructive",
        description: "Only creator are allowed to delete document",
      });
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    setIsRemoving(true);
    await deleteDocument();
    setRemoveTrigger(true);
    setIsRemoving(false);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle> Are you sure? </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            document.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction disabled={isRemoving} onClick={handleDelete}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertForDelete;
