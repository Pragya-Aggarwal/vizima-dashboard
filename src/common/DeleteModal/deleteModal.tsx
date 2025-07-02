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
  handleDelete: () => void;
};

export const DeleteModal = ({ open, setOpen, handleDelete }: DeleteModalProps) => {
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
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">
            This action cannot be undone. This will permanently delete the item from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex justify-center gap-4 mt-4">
          <AlertDialogCancel className="px-4 py-2 rounded border">
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            className="bg-primary text-white hover:bg-primary px-4 py-2 rounded"
          >
            Confirm Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
