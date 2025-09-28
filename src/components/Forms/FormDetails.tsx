import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FormData } from '@/types/form';
import { Badge } from '@/components/ui/badge';

interface FormDetailsProps {
  form: FormData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function FormDetails({ form, open, onOpenChange }: FormDetailsProps) {
  if (!form) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Form Submission Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{form.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{form.email || 'N/A'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{form.phone || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">{form.location || 'N/A'}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">PG Type</p>
            <div className="mt-1">
              <Badge variant="outline" className="capitalize">
                {form.pgType || 'N/A'}
              </Badge>
            </div>
          </div>

          {form.message && (
            <div>
              <p className="text-sm text-muted-foreground">Message</p>
              <p className="font-medium whitespace-pre-line">{form.message}</p>
            </div>
          )}

          {(form.createdAt || form.updatedAt) && (
            <div className="grid grid-cols-2 gap-4">
              {form.createdAt && (
                <div>
                  <p className="text-sm text-muted-foreground">Submitted On</p>
                  <p className="font-medium">
                    {new Date(form.createdAt).toLocaleString()}
                  </p>
                </div>
              )}
              {form.updatedAt && (
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">
                    {new Date(form.updatedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
