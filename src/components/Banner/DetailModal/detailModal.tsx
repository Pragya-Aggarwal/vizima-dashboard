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
  createdAt: string;
  updatedAt: string;
}

type BannerModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  banner: Banner;
}

import { format } from 'date-fns';
import LoadingIndicator from "@/src/common/LoadingIndicator/loading"

const DetailModal = ({ open, setOpen, banner }: BannerModalProps) => {
  if (!banner) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Banner Details</DialogTitle>
          <DialogDescription>View complete banner information</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Banner Image */}
          <div className="flex justify-center">
            <img
              src={banner.image}
              alt={banner.title}
              className="max-h-64 w-auto rounded-lg object-cover shadow"
            />
          </div>

          {/* Title and Status */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">{banner.title}</h2>
            <div className="flex items-center gap-2">
              <Badge variant={banner.isActive ? "default" : "secondary"}>
                {banner.isActive ? 'Active' : 'Inactive'}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Hash size={12} /> Order: {banner.order}
              </Badge>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
              <p>{banner.type}</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">Target Audience</h3>
              <p>{banner.targetAudience}</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">Display Locations</h3>
              <div className="flex flex-wrap gap-1">
                {banner.displayLocation?.map((location, index) => (
                  <Badge key={index} variant="outline">{location}</Badge>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">Link</h3>
              <a 
                href={banner.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {banner.link}
              </a>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">Active Period</h3>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  <span>Start: {format(new Date(banner.startDate), 'PPp')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  <span>End: {format(new Date(banner.endDate), 'PPp')}</span>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
              <p>{format(new Date(banner.createdAt), 'PPpp')}</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
            <p className="whitespace-pre-line">{banner.description}</p>
          </div>
        </div>
      </DialogContent>
      <div className="text-xs text-muted-foreground text-center mt-2 space-y-1">
        <div className="flex justify-center items-center gap-1">
          <Calendar size={12} /> Created:{" "}
          {format(new Date(banner.createdAt), 'PPpp')}
        </div>
        <div className="flex justify-center items-center gap-1">
          <Calendar size={12} /> Updated:{" "}
          {format(new Date(banner.updatedAt), 'PPpp')}
        </div>
      </div>
    </Dialog>
  )
}

export default DetailModal
