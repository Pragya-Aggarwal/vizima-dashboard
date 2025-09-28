import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Eye } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/ui/pagination';
import { getForms, deleteForm } from '@/services/formServices';
import { FormData } from '@/types/form';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface FormsListProps {
  onView: (form: FormData) => void;
}

export default function FormsList({ onView }: FormsListProps) {
  const [forms, setForms] = useState<FormData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const router = useRouter();

  const fetchForms = async () => {
    try {
      setIsLoading(true);
      const response = await getForms({
        page: pagination.page,
        limit: pagination.limit,
      });
      
      // Handle the response based on its structure
      if (Array.isArray(response)) {
        // If the response is an array of form data
        setForms(response);
        setPagination(prev => ({
          ...prev,
          total: response.length,
          totalPages: Math.ceil(response.length / pagination.limit) || 1,
        }));
      } else if (response && typeof response === 'object' && 'data' in response) {
        // If the response has a data property
        const responseData = response as { data: any };
        const formsData = Array.isArray(responseData.data) ? responseData.data : [];
        
        setForms(formsData);
        setPagination(prev => ({
          ...prev,
          total: formsData.length,
          totalPages: Math.ceil(formsData.length / pagination.limit) || 1,
        }));
      } else {
        // Fallback for unexpected response format
        console.warn('Unexpected response format:', response);
        setForms([]);
        setPagination(prev => ({
          ...prev,
          total: 0,
          totalPages: 1,
        }));
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
      toast.error('Failed to load forms');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this form submission?')) {
      try {
        await deleteForm(id);
        toast.success('Form submission deleted successfully');
        fetchForms();
      } catch (error) {
        console.error('Error deleting form:', error);
        toast.error('Failed to delete form submission');
      }
    }
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  useEffect(() => {
    fetchForms();
  }, [pagination.page]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>PG Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {forms.length > 0 ? (
              forms.map((form) => (
                <TableRow key={form._id}>
                  <TableCell>{form.name}</TableCell>
                  <TableCell>{form.phone}</TableCell>
                  <TableCell>{form.location}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {form.pgType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(form)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => form._id && handleDelete(form._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No form submissions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
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
