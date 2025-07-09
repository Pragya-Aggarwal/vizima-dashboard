'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, Loader2, AlertCircle, Trash } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { LeadDetails } from './components/lead-details';
import { DeleteModal } from '@/src/common/DeleteModal/deleteModal';

interface Lead {
  _id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  message: string;
  createdAt: string;
  status?: string;
  source?: string;
}

interface ApiResponse {
  data: Lead[];
  message?: string;
  success: boolean;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function CustomerLeadPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  useEffect(() => {
    fetchLeads();
  }, [pagination.page, pagination.limit]);

  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const url = new URL('https://api.vizima.in/api/contact/messages');
      url.searchParams.append('page', pagination.page.toString());
      url.searchParams.append('limit', pagination.limit.toString());

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          // Uncomment and add your auth token if required
          // 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`
        },
        // Add credentials if needed
        // credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Error: ${response.status} - ${response.statusText}`
        );
      }

      const data: ApiResponse = await response.json();
      
      if (data.success && data.data) {
        setLeads(data.data);
        if (data.pagination) {
          setPagination(prev => ({
            ...prev,
            total: data.pagination?.total || 0,
            totalPages: data.pagination?.totalPages || 1,
          }));
        }
      } else {
        throw new Error(data.message || 'Failed to fetch leads');
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: `Failed to load leads: ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleView = (lead: Lead) => {
    setSelectedLead(lead);
  };

  const handleDeleteClick = (id: string) => {
    console.log('Delete clicked for ID:', id); // Debug log
    setLeadToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!leadToDelete) {
      console.error('No lead ID to delete');
      return;
    }
    
    console.log('Deleting lead with ID:', leadToDelete); // Debug log
    
    try {
      const response = await fetch(`https://api.vizima.in/api/contact/message/${leadToDelete}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          // Uncomment and add your auth token if required
          // 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Error: ${response.status} - ${response.statusText}`
        );
      }

      // Optimistically update the UI
      setLeads(leads.filter(lead => lead._id !== leadToDelete));
      setDeleteModalOpen(false);
      
      toast({
        title: 'Success',
        description: 'Lead deleted successfully',
        
      });
    } catch (error) {
      console.error('Error deleting lead:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete lead';
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLeadToDelete(null);
    }
  };

  if (loading && leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading leads...</p>
      </div>
    );
  }

  if (error && leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4 p-4 text-center">
        <div className="rounded-full bg-destructive/10 p-3">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <div>
          <h3 className="text-lg font-medium">Failed to load leads</h3>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
        <Button 
          variant="outline" 
          onClick={fetchLeads}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Retrying...
            </>
          ) : (
            'Retry'
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {selectedLead && (
        <LeadDetails 
          lead={selectedLead} 
          onClose={() => setSelectedLead(null)} 
        />
      )}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customer Leads</h1>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.length > 0 ? (
              leads.map((lead) => (
                <TableRow key={lead._id}>
                  <TableCell className="font-medium">{lead.fullName}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.mobileNumber}</TableCell>
                  <TableCell className="max-w-xs truncate">{lead.message}</TableCell>
                  <TableCell>{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(lead)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteClick(lead?._id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No leads found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DeleteModal 
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        onDelete={handleDelete}
        title="Delete Lead"
        description="Are you sure you want to delete this lead? This action cannot be undone."
      />
    </div>
  );
};
