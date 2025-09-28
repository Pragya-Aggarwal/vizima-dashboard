import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ContactFormData } from "../Schema/contact-schema";

interface ViewContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: ContactFormData | null;
}

export default function ViewContactModal({
  open,
  onOpenChange,
  contact,
}: ViewContactModalProps) {
  if (!contact) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Contact Number Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Phone Number</p>
              <p className="font-medium">{contact.number || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={contact.isActive ? "default" : "secondary"}>
                {contact.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Description</p>
            <p className="font-medium">
              {contact.description || "No description provided"}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Display Order</p>
            <p className="font-medium">{contact.order}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}