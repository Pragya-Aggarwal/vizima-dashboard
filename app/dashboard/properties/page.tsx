"use client"

import { useState } from "react"
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner";
import { useAuthRedirect } from "@/hooks/use-Redirect"
import { PropertyFormData } from "@/src/components/Property/Schema/property-schema"
import { getPropertiesfullInquiries, addProperty } from "@/src/services/propertyService"
import Header from "@/src/components/Property/header/header"
import PropertyList from "@/src/components/Property/PropertyList/list"
import Pagination from "@/src/components/Property/pagination/pagination"

const ITEMS_PER_PAGE = 10;

type Property = {
  _id: string;
  title: string;
  price: number;
  type: string;
  city: string;
  state?: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  isAvailable: boolean;
  isFeatured: boolean;
  status?: string;
  createdAt: string;
  [key: string]: any;
};

type ApiResponse = {
  data: {
    properties: Property[];
    total: number;
    totalPages: number;
  };
};

export default function PropertiesPage() {
  // State management
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [sharingType, setSharingType] = useState('all');
  const [bedrooms, setBedrooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isAvailableTouched, setIsAvailableTouched] = useState(false);
  const [isFeaturedTouched, setIsFeaturedTouched] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  useAuthRedirect(); // Ensure user is authenticated

  interface PropertyResponse {
    data: {
      properties: any[];
      total: number;
      totalPages: number;
    };
  }

  const { data, isLoading, error } = useQuery<PropertyResponse, Error>({
    queryKey: ['properties', currentPage, search, type, sharingType, bedrooms, bathrooms, isAvailable, isFeatured, city, state, selectedAmenities, sortBy, sortOrder],
    queryFn: async (): Promise<PropertyResponse> => {
      const payload = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        ...(search && { search }),
        ...(type && { type }),
        ...(sharingType !== 'all' && { sharingType }),
        ...(bedrooms > 0 && { bedrooms }),
        ...(bathrooms > 0 && { bathrooms }),
        ...(isAvailableTouched && { isAvailable }),
        ...(isFeaturedTouched && { isFeatured }),
        ...(city && { city }),
        ...(state && { state }),
        ...(selectedAmenities.length > 0 && { amenities: selectedAmenities.join(',') }),
        sortBy,
        sortOrder,
      };
      const response = await getPropertiesfullInquiries(payload);
      return response as unknown as PropertyResponse;
    },
  });

  const properties = data?.data?.properties || [];
  const totalPages = data?.data?.totalPages ?? 1;
  const totalItems = data?.data?.total ?? 0;

  const handleExport = async () => {
    try {
      const payload = {
        page: 1,
        limit: data?.data?.total || 1000,
        ...(search && { search }),
        ...(type && { type }),
        ...(sharingType !== 'all' && { sharingType }),
        ...(bedrooms > 0 && { bedrooms }),
        ...(bathrooms > 0 && { bathrooms }),
        ...(isAvailableTouched && { isAvailable }),
        ...(isFeaturedTouched && { isFeatured }),
        ...(city && { city }),
        ...(state && { state }),
        ...(selectedAmenities.length > 0 && { amenities: selectedAmenities.join(',') }),
      };

      const res = await getPropertiesfullInquiries(payload);
      const records = res?.data?.properties || [];

      if (!records.length) {
        toast.error("No data available to export.");
        return;
      }

      const exportData = records.map((property: Property) => ({
        'ID': property._id,
        'Title': property.title,
        'Price': property.price,
        'Type': property.type,
        'City': property.city,
        'State': property.state || 'N/A',
        'Address': property.address,
        'Bedrooms': property.bedrooms,
        'Bathrooms': property.bathrooms,
        'Is Available': property.isAvailable ? 'Yes' : 'No',
        'Is Featured': property.isFeatured ? 'Yes' : 'No',
        'Status': property.status || 'N/A',
        'Created At': new Date(property.createdAt).toLocaleDateString(),
      }));

      const headers = Object.keys(exportData[0]);
      let csvContent = headers.join(',') + '\n';

      exportData.forEach((item: any) => {
        const row = headers.map(header => {
          const value = item[header];
          if (value === null || value === undefined) return '';
          const stringValue = String(value);
          if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        });
        csvContent += row.join(',') + '\n';
      });

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `properties_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Data exported successfully.");
    } catch (error) {
      console.error("Export Error:", error);
      toast.error("Failed to export data.");
    }
  };

  const handleAddProperty = async (formData: PropertyFormData, onSuccess: () => void) => {
    try {
      await addProperty(formData);
      toast.success('Property added successfully');

      // Invalidate and refetch properties query
      await queryClient.invalidateQueries({ queryKey: ['properties'] });

      onSuccess();
      setOpen(false);
    } catch (error) {
      console.error('Error adding property:', error);
      toast.error('Failed to add property');
    }
  };

  return (
    <div className="space-y-6 p-4">
      <Header
        open={open}
        setOpen={setOpen}
        onSubmit={handleAddProperty}
        onExport={handleExport}
        properties={properties}
      />

      <PropertyList
        properties={properties}
        search={search}
        setSearch={setSearch}
        type={type}
        setType={setType}
        sharingType={sharingType}
        setSharingType={setSharingType}
        isLoading={isLoading}
        bathrooms={bathrooms}
        setBathrooms={setBathrooms}
        bedrooms={bedrooms}
        setBedrooms={setBedrooms}
        isAvailable={isAvailable}
        setIsAvailable={setIsAvailable}
        isFeatured={isFeatured}
        setIsFeatured={setIsFeatured}
        city={city}
        setCity={setCity}
        state={state}
        setState={setState}
        selectedAmenities={selectedAmenities}
        setSelectedAmenities={setSelectedAmenities}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        isAvailableTouched={isAvailableTouched}
        setIsAvailableTouched={setIsAvailableTouched}
        isFeaturedTouched={isFeaturedTouched}
        setIsFeaturedTouched={setIsFeaturedTouched}
      />

      {!isLoading && totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>

  )
}
