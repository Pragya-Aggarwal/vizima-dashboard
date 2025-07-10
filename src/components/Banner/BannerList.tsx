import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Pencil, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Banner {
  _id: string;
  title: string;
  description: string;
  image: string;
  isActive: boolean;
  order: number;
  type: string;
  targetAudience: string;
  displayLocation: string[];
  startDate: string;
  endDate: string;
  link: string;
}

interface BannerListProps {
  bannerData: {
    data: Banner[];
    page: number;
    total: number;
  };
  isLoading: boolean;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

export function BannerList({ bannerData, isLoading, onEdit, onView, onDelete }: BannerListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }
  if (!bannerData || bannerData.length === 0) {
    return (
      <div className="text-center py-10">
        <p>No banners found</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bannerData.map((banner) => (
            <TableRow key={banner._id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  {banner.image && (
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="h-10 w-16 object-cover rounded"
                    />
                  )}
                  <span>{banner.title}</span>
                </div>
              </TableCell>
              <TableCell>{banner.type}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${banner.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {banner.isActive ? 'Active' : 'Inactive'}
                </span>
              </TableCell>
              <TableCell>{new Date(banner.startDate).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(banner.endDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onView(banner._id)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(banner._id)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(banner._id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
