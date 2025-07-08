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
// import { getCityById } from "@/src/services/cityServices";
import { getFaqById } from "@/src/services/FaqServices";
import LoadingIndicator from "@/src/common/LoadingIndicator/loading"
import { formatReadableDate } from "@/src/common/common";

const DetailModal = ({ open, setOpen, testimonialId }: TestimonialModalProps) => {


  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState();

  useEffect(() => {
    const fetch = async () => {
      if (testimonialId && open) {
        setLoading(true);
        try {
          const res = await getFaqById(testimonialId);setDetail(res);
        } catch (err) {
          console.error("Failed to fetch faq", err);
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
          <DialogTitle>FAQ Detail</DialogTitle>
          <DialogDescription>See complete FAQ details below</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="text-center text-sm text-muted-foreground">
            <LoadingIndicator />
          </div>
        ) : detail ? (
          <div className="space-y-6">
            {/* Question */}
            <div className="space-y-1">
              <h2 className="text-lg font-semibold flex items-center gap-1">
                ❓ Question:
              </h2>
              <p className="text-base text-muted-foreground">{detail?.question}</p>
            </div>

            {/* Answer */}
            <div className="space-y-1">
              <h2 className="text-lg font-semibold flex items-center gap-1">
                💬 Answer:
              </h2>
              <p className="text-base text-muted-foreground">{detail?.answer}</p>
            </div>

            {/* Order */}
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Hash size={12} /> Order: {detail?.order}
              </Badge>
            </div>

            {/* Dates */}
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex items-center gap-1">
                <Calendar size={12} /> Created: {formatReadableDate(detail?.createdAt)}
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={12} /> Updated: {formatReadableDate(detail?.updatedAt)}
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





