import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Trash } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

type DeleteModalProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onDelete: () => void;
  title?: string;
  description?: string;
};

export const DeleteModal = ({ 
  open, 
  setOpen, 
  onDelete, 
  title = "Are you absolutely sure?",
  description = "This action cannot be undone. This will permanently delete the item from the system."
}: DeleteModalProps) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {/* Optional Trigger, if you want to show a delete icon */}
      {/* <AlertDialogTrigger asChild>
        <Button variant="destructive"><Trash /> Delete</Button>
      </AlertDialogTrigger> */}

      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="flex flex-col items-center text-center space-y-4">
          <div className="p-4 border-2 border-dashed border-primary rounded-full">
            <Trash size={40} className="text-primary" />
          </div>

          <AlertDialogTitle className="text-xl font-semibold text-primary">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex justify-center gap-4 mt-4">
          <AlertDialogCancel className="px-4 py-2 rounded border">
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onDelete}
            className="bg-primary text-white hover:bg-primary px-4 py-2 rounded"
          >
            Confirm Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
