"use client"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, User } from "lucide-react";
import { Eye, EyeOff, Hash, Calendar } from "lucide-react";
import { format } from "date-fns"
import { City } from "@/types/city"
import Image from "next/image"

interface CityModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  cityId: string | null;
};

import { getCityById } from "@/src/services/cityServices";
import LoadingIndicator from "@/src/common/LoadingIndicator/loading"
import { formatReadableDate } from "@/src/common/common";

const DetailModal = ({ open, setOpen, cityId }: CityModalProps) => {
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<City | null>(null);
console.log(cityId, open, detail)
  useEffect(() => {
    const fetchCity = async () => {
      if (!cityId || !open) {
        setDetail(null);
        return;
      }
      
      setLoading(true);
      try {
        console.log('Fetching city with ID:', cityId);
        const res = await getCityById(cityId);
        console.log('City data received:', res);
        setDetail(res);
      } catch (error) {
        console.error("Error fetching city:", error);
        toast.error("Failed to load city details");
      } finally {
        setLoading(false);
      }
    };

    // Reset detail when modal is closed
    if (!open) {
      setDetail(null);
    } else {
      fetchCity();
    }
  }, [cityId, open]);


console.log(detail)
  return (

    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>City Detail</DialogTitle>
          <DialogDescription>See complete City Detail</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-8">
            <LoadingIndicator />
            <p className="mt-2 text-sm text-muted-foreground">Loading city details...</p>
          </div>
        ) : detail ? (
          <div className="space-y-4">
            {/* Image */}
            {detail?.imageUrl && (
              <div className="space-y-2">
                <Label>Image</Label>
                <div className="relative aspect-video overflow-hidden rounded-lg border">
                  <Image
                    src={detail.imageUrl}
                    alt={detail.name || 'City image'}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

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
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is-visible"
                      checked={detail?.isVisible || false}
                      disabled
                    />
                    <Label htmlFor="is-visible">
                      {detail?.isVisible ? "Visible" : "Hidden"}
                    </Label>
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
                <p>
                  Created: {detail?.createdAt ? format(new Date(detail.createdAt), 'PPpp') : 'N/A'}
                </p>
                <p>
                  Updated: {detail?.updatedAt ? format(new Date(detail.updatedAt), 'PPpp') : 'N/A'}
                </p>
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





