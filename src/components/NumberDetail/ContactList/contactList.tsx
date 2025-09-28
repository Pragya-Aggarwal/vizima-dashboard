import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { Edit, Trash2, Eye } from "lucide-react";
import { Skeleton } from "../../../../components/ui/skeleton";
import { Pagination } from "../../../../components/ui/pagination";

interface ContactListProps {
  contacts: any[];
  isLoading: boolean;
  onView?: (contact: any) => void;
  onEdit: (contact: any) => void;
  onDelete: (contact: any) => void;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
}

export default function ContactList({
  contacts,
  isLoading,
  onView,
  onEdit,
  onDelete,
  pagination,
  onPageChange,
}: ContactListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  // Ensure contacts is an array before checking length
  const safeContacts = Array.isArray(contacts) ? contacts : [];

  if (safeContacts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No contact numbers found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Phone Number</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {safeContacts.map((contact) => (
              <TableRow key={contact._id}>
                <TableCell className="font-medium">{contact.number}</TableCell>
                <TableCell>{contact.description}</TableCell>
                <TableCell>
                  <Badge variant={contact.isActive ? "default" : "secondary"}>
                    {contact.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>{contact.order}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    {onView && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(contact)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(contact)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => onDelete(contact)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
