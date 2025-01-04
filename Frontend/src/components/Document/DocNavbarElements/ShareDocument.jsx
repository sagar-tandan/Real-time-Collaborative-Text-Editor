import React, { useState, useCallback, useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon, Share2Icon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import MyContext from "@/Context/MyContext";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const ShareDocument = () => {
  const { token, endPoint, user } = useContext(MyContext);
  const [emails, setEmails] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const docId = useParams();
  const { toast } = useToast();

  const validateEmail = useCallback((email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const clearError = useCallback(() => {
    setError("");
  }, []);

  const handleInputChange = useCallback(
    (e) => {
      setInputValue(e.target.value);
      clearError();
    },
    [clearError]
  );

  const addEmail = useCallback(() => {
    const trimmedEmail = inputValue.trim().replace(/,/g, "");

    if (!trimmedEmail) return;

    if (!validateEmail(trimmedEmail)) {
      setError("Please enter a valid email");
      return;
    }

    if (emails.includes(trimmedEmail)) {
      setError("Email already added");
      return;
    }

    setEmails((prev) => [...prev, trimmedEmail]);
    setInputValue("");
    clearError();
  }, [inputValue, emails, validateEmail, clearError]);

  const removeEmail = useCallback((indexToRemove) => {
    setEmails((prev) => prev.filter((_, index) => index !== indexToRemove));
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        addEmail();
      } else if (e.key === "Backspace" && !inputValue && emails.length > 0) {
        setEmails((prev) => prev.slice(0, -1));
      }
    },
    [addEmail, inputValue, emails.length]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emails.length === 0 && !inputValue) {
      setError("You need to provide at least one email");
      return;
    }
    await addCollaborators();
  };

  const addCollaborators = async () => {
    try {
      const response = await axios.post(
        `${endPoint}/api/document/add-collaborator`,
        { docId: docId, emails: emails, ownerId: user?.userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log(response);
        toast({
          description: response.data.message,
        });
        setEmails([]);
        setIsDialogOpen(false);
      } else {
        toast({
          variant: "destructive",
          description: response.data.message,
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        description: error.response.data.message,
      });
    }
  };

  const handleDialogClose = useCallback(() => {
    setIsDialogOpen(false);
    setInputValue("");
    clearError();
  }, [clearError]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <button className="absolute top-0 right-[60px] flex gap-2 items-center justify-center py-2 px-4 bg-blue-300 rounded-full hover:bg-blue-400 transition-all duration-200 ease-in-out">
          <PlusIcon className="size-4" />
          <span className="font-medium">Add Collaborators</span>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add memeber to "Untitled Document"</DialogTitle>
          <DialogDescription>
            <form
              onSubmit={handleSubmit}
              className="w-full flex-col gap-y-1 mt-3"
            >
              <div className="w-full max-w-2xl">
                <div className="min-h-24 p-2 border rounded-md focus-within:ring-1 focus-within:ring-black focus-within:border-black">
                  <div className="flex flex-wrap gap-2">
                    {emails.map((email, index) => (
                      <div
                        key={`${email}-${index}`}
                        className="flex items-center gap-1 px-2 py-1 bg-blue-100 rounded-md group"
                      >
                        <span className="text-sm text-blue-800">{email}</span>
                        <button
                          type="button"
                          onClick={() => removeEmail(index)}
                          className="p-1 rounded-full hover:bg-blue-200 transition-colors"
                          aria-label={`Remove ${email}`}
                        >
                          <X className="w-3 h-3 text-blue-800" />
                        </button>
                      </div>
                    ))}
                    <input
                      type="text"
                      value={inputValue}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      onBlur={addEmail}
                      className="flex-grow min-w-40 p-1 outline-none"
                      placeholder={
                        emails.length === 0 ? "Enter email addresses..." : ""
                      }
                      aria-label="Email input"
                    />
                  </div>
                </div>
                {error && (
                  <p className="mt-1 text-sm text-red-500" role="alert">
                    {error}
                  </p>
                )}
              </div>

              <div className="w-full justify-end flex gap-x-3 mt-4">
                <Button
                  type="button"
                  onClick={handleDialogClose}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button type="submit">Send</Button>
              </div>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDocument;
