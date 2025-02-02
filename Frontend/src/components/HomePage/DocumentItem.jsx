import React, { useContext, useState } from "react";
import { TableCell, TableRow } from "../ui/table";
import {
  Building2Icon,
  CircleUserIcon,
  ExternalLinkIcon,
  FilePen,
  MoreVertical,
  Share2Icon,
  TrashIcon,
} from "lucide-react";
import { SiGoogledocs } from "react-icons/si";
import { format } from "date-fns";
import MyContext from "@/Context/MyContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import AlertForDelete from "./AlertForDelete";
import RenameDialog from "./RenameDialog";

const DocumentItem = ({ document }) => {
  const { user } = useContext(MyContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);

  return (
    <TableRow
      onClick={() => navigate(`/document/${document.doc_id}`)}
      className="cursor-pointer hover:bg-neutral-100/80"
    >
      <TableCell className="w-[50px]">
        <SiGoogledocs className="size-6 fill-blue-500" />
      </TableCell>

      <TableCell className="font-medium md:w-[40%] py-1">
        {document.doc_title}
      </TableCell>

      <TableCell className="hidden md:flex items-center gap-2">
        {document.doc_type === "Personal" ? (
          document.createdBy === user?.userId ? (
            <CircleUserIcon className="size-5" />
          ) : (
            <Share2Icon className="size-5" />
          )
        ) : (
          <Building2Icon className="size-5" />
        )}

        {document.doc_type === "Personal"
          ? document.createdBy === user?.userId
            ? "Personal"
            : document.ownerName
          : "Organization"}
      </TableCell>

      <TableCell className="hidden md:table-cell py-1">
        {format(new Date(document.updatedAt), "MMM dd, yyyy")}
      </TableCell>

      <TableCell className="py-1 flex ml-auto justify-end">
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger
            onClick={(e) => e.stopPropagation()}
            className="cursor-pointer"
          >
            <MoreVertical className="z-10 size-9 hover:bg-neutral-300/80 rounded-full p-2 text-neutral-800 transition-all ease-in-out duration-300" />
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setShowRenameDialog(true);
                setOpen(false);
              }}
              onSelect={(e) => e.preventDefault()}
            >
              <FilePen className="size-4 mr-2" />
              Rename
            </DropdownMenuItem>

            <AlertForDelete docId={document.doc_id}>
              <DropdownMenuItem
                onClick={(e) => e.stopPropagation()}
                onSelect={(e) => e.preventDefault()}
              >
                <TrashIcon className="size-4 mr-2" />
                Remove
              </DropdownMenuItem>
            </AlertForDelete>

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                window.open(`/document/${document.doc_id}`, "_blank");
              }}
            >
              <ExternalLinkIcon className="size-4 mr-2" />
              Open in new Tab
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>

      {showRenameDialog && (
        <RenameDialog
          docId={document.doc_id}
          initialTitle={document.doc_title}
          onClose={() => setShowRenameDialog(false)}
        />
      )}
    </TableRow>
  );
};

export default DocumentItem;
