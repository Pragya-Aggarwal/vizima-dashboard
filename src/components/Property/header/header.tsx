import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import AddPropertyModal from "../AddPropertyModal/propertyModal"
import { PropertyFormData } from "../Schema/property-schema"

// Define the Property type here since we can't import it directly
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
    [key: string]: any; // For any additional properties
};

interface HeaderProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onSubmit: (data: PropertyFormData, onSuccess: () => void) => void;
    onExport?: () => Promise<void>;
    properties?: Property[];
}

const Header = ({ open, setOpen, onSubmit, onExport, properties = [] }: HeaderProps) => {
    const handleExport = () => {
        if (!properties || properties.length === 0) {
            console.error('No properties to export');
            return;
        }
        
        // Format properties for export
        const exportData = properties.map(property => ({
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
        
        // Convert to CSV
        const headers = Object.keys(exportData[0]);
        let csvContent = headers.join(',') + '\n';
        
        exportData.forEach(item => {
            const row = headers.map(header => {
                const value = (item as any)[header]; // Fix TypeScript error with dynamic property access
                if (value === null || value === undefined) return '';
                // Escape quotes and wrap in quotes if contains comma, newline or quote
                const stringValue = String(value);
                if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
                    return `"${stringValue.replace(/"/g, '""')}"`;
                }
                return stringValue;
            });
            csvContent += row.join(',') + '\n';
        });
        
        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `properties_export_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    return (
        <div className="flex justify-between items-center mt-5 mx-5">
            <div>
                <h2 className="text-2xl font-bold">Property Management</h2>
                <p className="text-muted-foreground">Manage your PG and Hostel listings</p>
            </div>
            <div className="flex space-x-2">
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-auto gap-1"
                    onClick={onExport || handleExport}
                    disabled={!properties || properties.length === 0}
                >
                    <Download className="h-4 w-4" />
                    Export
                </Button>
                <AddPropertyModal open={open} setOpen={setOpen} onSubmit={onSubmit} />
            </div>
        </div>
    )

}


export default Header