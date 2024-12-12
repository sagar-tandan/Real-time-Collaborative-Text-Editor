import MyContext from "@/Context/MyContext";
import {
  Image,
  ImageIcon,
  Link,
  Link2,
  SearchIcon,
  UploadIcon,
} from "lucide-react";
import React, { useContext, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ImageButton = () => {
  const { editor } = useContext(MyContext);
  const [imageUrl, setImageUrl] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const onChange = (src) => {
    editor?.chain().focus().setImage({ src: src }).run();
  };

  const handleImageUrlSubmit = () => {
    if (imageUrl) {
      onChange(imageUrl);
      setImageUrl("");
      setDialogOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu className="z-10">
        <DropdownMenuTrigger>
          <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 text-sm px-2 overflow-hidden">
            <ImageIcon className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="z-10 bg-white shadow-sm shadow-gray-300 rounded-sm">
          <DropdownMenuItem className="flex gap-2 items-center p-2.5 cursor-pointer outline-none hover:bg-neutral-200/80">
            <UploadIcon className="size-4" />
            <span>Upload</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setDialogOpen(true)}
            className="flex gap-2 items-center p-2.5 cursor-pointer outline-none hover:bg-neutral-200/80"
          >
            <SearchIcon className="size-4" />
            <span>Paste image url</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Image Url</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Paste the image url"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleImageUrlSubmit();
              }
            }}
          />

          <DialogFooter>
            <Button
              onClick={(e) => {
                handleImageUrlSubmit();
              }}
            >
              Insert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageButton;
