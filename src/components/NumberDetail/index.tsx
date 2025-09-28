"use client"

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";

import { ContactFormData } from "./Schema/contact-schema";
import { 
  getContacts, 
  createContact, 
  updateContact, 
  deleteContact 
} from "../../services/contactServices";

import ContactList from "./ContactList/contactList";
import AddContactModal from "./AddContactModal/addContactModal";
import EditContactModal from "./EditContactModal/EditContactModal";
import ViewContactModal from "./ViewContactModal/ViewContactModal";
import DeleteDialog from "./DeleteDialog/deleteDialog";

export default function NumberDetail() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const fetchContacts = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getContacts({
        page: pagination.page,
        limit: pagination.limit,
      });
      
      // Ensure we have a valid response with data
      if (response && response.data && response.data.contactNumbers) {
        setContacts(Array.isArray(response.data.contactNumbers) ? response.data.contactNumbers : []);
        
        // Update pagination from response if available, otherwise use defaults
        setPagination(prev => ({
          page: response.data?.pagination?.page || prev.page,
          limit: response.data?.pagination?.limit || prev.limit,
          total: response.data?.pagination?.total || response.data.contactNumbers.length || 0,
          totalPages: response.data?.pagination?.totalPages || 1,
        }));
      } else {
        // If the response doesn't have the expected structure, set empty contacts
        setContacts([]);
      }
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
      toast.error("Failed to load contact numbers");
      setContacts([]); // Ensure contacts is always an array
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleAddContact = async (data: ContactFormData) => {
    try {
      await createContact(data);
      toast.success("Contact added successfully");
      setIsAddModalOpen(false);
      fetchContacts();
    } catch (error) {
      console.error("Failed to add contact:", error);
      toast.error("Failed to add contact");
    }
  };

  const handleUpdateContact = async (id: string, data: ContactFormData) => {
    try {
      await updateContact(id, data);
      toast.success("Contact updated successfully");
      setIsEditModalOpen(false);
      setSelectedContact(null);
      fetchContacts();
    } catch (error) {
      console.error("Failed to update contact:", error);
      toast.error("Failed to update contact");
    }
  };

  const handleDeleteContact = async () => {
    if (!selectedContact) return;
    
    try {
      await deleteContact(selectedContact._id);
      toast.success("Contact deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedContact(null);
      fetchContacts();
    } catch (error) {
      console.error("Failed to delete contact:", error);
      toast.error("Failed to delete contact");
    }
  };

  const handleViewClick = (contact: any) => {
    setSelectedContact(contact);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (contact: any) => {
    setSelectedContact(contact);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (contact: any) => {
    setSelectedContact(contact);
    setIsDeleteDialogOpen(true);
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="contacts">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Contact Numbers</CardTitle>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </CardHeader>
          <CardContent>
            <TabsContent value="contacts">
              <ContactList 
                contacts={Array.isArray(contacts) ? contacts : []}
                isLoading={isLoading}
                onView={handleViewClick}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>

      <AddContactModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSubmit={handleAddContact}
      />

      {selectedContact && (
        <>
          <EditContactModal
            open={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
            contact={selectedContact}
            onSubmit={handleUpdateContact}
          />
          
          <ViewContactModal
            open={isViewModalOpen}
            onOpenChange={setIsViewModalOpen}
            contact={selectedContact}
          />
          
          <DeleteDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            onConfirm={handleDeleteContact}
            title="Delete Contact"
            description={`Are you sure you want to delete ${selectedContact.description} (${selectedContact.number})?`}
          />
        </>
      )}
    </div>
  );
}
