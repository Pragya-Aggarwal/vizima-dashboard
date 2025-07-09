'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface LeadDetailsProps {
  lead: {
    id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    createdAt: string;
  } | null;
  onClose: () => void;
}

export function LeadDetails({ lead, onClose }: LeadDetailsProps) {
  if (!lead) return null;

  return (
    <Dialog open={!!lead} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Customer Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Name</h4>
              <p className="text-sm">{lead.fullName}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
              <p className="text-sm">{lead.email}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Phone</h4>
              <p className="text-sm">{lead.mobileNumber}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Date</h4>
              <p className="text-sm">{new Date(lead.createdAt).toLocaleString()}</p>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Message</h4>
            <p className="mt-1 text-sm whitespace-pre-line">{lead.message}</p>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
