"use client"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Star, MapPin, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Hash, Calendar } from "lucide-react";

type TestimonialModalProps = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  testimonialId: string | null;

}
import { getCityById } from "@/src/services/cityServices";
import LoadingIndicator from "@/src/common/LoadingIndicator/loading"
import { formatReadableDate } from "@/src/common/common";

const DetailModal = ({ open, setOpen, testimonialId }: TestimonialModalProps) => {


  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState()useEffect(() => {
    const fetch = async () => {
      if (testimonialId && open) {
        setLoading(true);
        try {
          const res = await getCityById(testimonialId);setDetail(res);
        } catch (err) {
          console.error("Failed to fetch testimonial", err);
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
          <DialogTitle>City Detail</DialogTitle>
          <DialogDescription>See complete City Detail</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="text-center text-sm text-muted-foreground"><LoadingIndicator/></div>
        ) : detail ? (
          <div className="space-y-6">
            {/* Image */}
            <div className="flex justify-center">
              <img
                src={detail?.imageUrl}
                alt={detail?.name}
                className="w-32 h-32 rounded-full object-cover shadow"
              />
            </div>

            {/* Name */}
            <div className="text-center space-y-1">
              <h2 className="text-lg font-semibold flex justify-center items-center gap-1">
                <MapPin size={16} /> {detail?.name}
              </h2>
            </div>

            {/* Status & Order */}
            <div className="flex justify-center items-center gap-3">
              <Badge variant={detail?.isVisible ? "default" : "secondary"}>
                {detail?.isVisible ? (
                  <div className="flex items-center gap-1">
                    <Eye size={14} /> Visible
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <EyeOff size={14} /> Hidden
                  </div>
                )}
              </Badge>

              <Badge variant="outline" className="flex items-center gap-1">
                <Hash size={12} /> Order: {detail?.order}
              </Badge>
            </div>

            {/* Dates */}
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
          <p className="text-center text-sm text-muted-foreground">No data found.</p>
        )}
      </DialogContent>
    </Dialog>





  )


}


export default DetailModal





