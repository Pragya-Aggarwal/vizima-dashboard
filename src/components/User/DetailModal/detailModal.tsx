import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, EyeOff, Hash, Mail, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";
import LoadingIndicator from "@/src/common/LoadingIndicator/loading";
import { getUserById } from "@/src/services/User";
import { formatReadableDate } from "@/src/common/common";

const DetailModal = ({
  open,
  setOpen,
  testimonialId,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  testimonialId: string | null;
}) => {
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      if (testimonialId && open) {
        setLoading(true);
        try {
          const res = await getUserById(testimonialId);
          setDetail(res?.data); // assuming API returns { success, data }
        } catch (err) {
          console.error("Failed to fetch user", err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetch();
  }, [testimonialId, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Detail</DialogTitle>
          <DialogDescription>See complete user information</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="text-center py-6">
            <LoadingIndicator />
          </div>
        ) : detail ? (
          <div className="space-y-6">
            {/* Avatar (if available) */}
            <div className="flex justify-center">
              <img
                src={detail?.avatar || "/avatar-placeholder.png"}
                alt={detail?.name}
                className="w-24 h-24 rounded-full object-cover shadow"
              />
            </div>

            {/* Name & Contact */}
            <div className="text-center space-y-1">
              <h2 className="text-lg font-semibold flex justify-center items-center gap-1">
                <User size={16} /> {detail?.name}
              </h2>
              <div className="text-sm text-muted-foreground flex justify-center items-center gap-1">
                <Mail size={14} /> {detail?.email}
              </div>
              <div className="text-sm text-muted-foreground flex justify-center items-center gap-1">
                <Phone size={14} /> {detail?.phone}
              </div>
            </div>

            {/* Verification & Role */}
            <div className="flex justify-center items-center gap-3">
              <Badge variant={detail?.isVerified ? "default" : "secondary"}>
                {detail?.isVerified ? (
                  <div className="flex items-center gap-1">
                    <Eye size={14} /> Verified
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <EyeOff size={14} /> Not Verified
                  </div>
                )}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Hash size={12} /> Role: {detail?.role}
              </Badge>
            </div>

            {/* Preferences */}
            <div className="border-t pt-4 space-y-2">
              <h4 className="text-md font-semibold">Preferences</h4>
              <div className="text-sm">
                <strong>Price Range:</strong>{" "}
                ₹{detail?.preferences?.priceRange?.min} - ₹
                {detail?.preferences?.priceRange?.max}
              </div>
              <div className="text-sm">
                <strong>Property Types:</strong>{" "}
                {detail?.preferences?.propertyType?.length > 0
                  ? detail?.preferences?.propertyType?.join(", ")
                  : "N/A"}
              </div>
            </div>

            {/* Created & Updated Dates */}
            <div className="text-xs text-muted-foreground text-center mt-2 space-y-1">
              <div className="flex justify-center items-center gap-1">
                <Calendar size={12} /> Created:{" "}
                {formatReadableDate(detail?.createdAt)}
              </div>
              <div className="flex justify-center items-center gap-1">
                <Calendar size={12} /> Updated:{" "}
                {formatReadableDate(detail?.updatedAt)}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            No user data found.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DetailModal;






