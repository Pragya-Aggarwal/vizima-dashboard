"use client"
import { useState,useEffect } from "react"
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



type TestimonialModalProps = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    testimonialId: string | null;

}
import { getTestimonialById } from "@/src/services/testmonialServices";
import LoadingIndicator from "@/src/common/LoadingIndicator/loading"

const TestimonialDetailModal = ({ open, setOpen, testimonialId }: TestimonialModalProps) => {


    const [loading, setLoading] = useState(false);
    const [testimonial ,setTestimonial ]= useState()


    console.log("testimonial from state" , testimonial )

    useEffect(() => {
        const fetchTestimonial = async () => {
            if (testimonialId && open) {
                setLoading(true);
                try {
                    const res = await getTestimonialById(testimonialId);
                    setTestimonial(res?.data);
                } catch (err) {
                    console.error("Failed to fetch testimonial", err);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchTestimonial();
    }, [testimonialId, open]);



    return (

        // <Dialog open={open} onOpenChange={setOpen}>
        //     <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        //         <DialogHeader>
        //             <DialogTitle>Update Testimonial</DialogTitle>
        //             <DialogDescription>Update a Existing Testimonial</DialogDescription>
        //         </DialogHeader>

        //         <div className="space-y-6">{testimonialId}</div>

        //     </DialogContent>
        // </Dialog>



        <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Testimonial Detail</DialogTitle>
          <DialogDescription>See complete customer testimonial</DialogDescription>
        </DialogHeader>

        {loading ? (
          <LoadingIndicator />
        ) : testimonial ? (
          <div className="space-y-6">
            {/* Image */}
            <div className="flex justify-center">
              <img
                src={testimonial?.picture}
                alt={testimonial?.name}
                className="w-32 h-32 rounded-full object-cover shadow"
              />
            </div>

            {/* Name & City */}
            <div className="text-center space-y-1">
              <h2 className="text-lg font-semibold flex justify-center items-center gap-1">
                <User size={16} /> {testimonial?.name}
              </h2>
              <p className="text-muted-foreground flex justify-center items-center gap-1 text-sm">
                <MapPin size={14} />
                {testimonial?.city}
              </p>
            </div>

            {/* Rating */}
            <div className="flex justify-center items-center gap-1">
              {[...Array(testimonial?.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-sm text-muted-foreground">({testimonial?.rating})</span>
            </div>

            {/* Comment */}
            <div className="text-center">
              <p className="text-sm italic text-gray-700">"{testimonial?.comment}"</p>
            </div>

            {/* Status & Order */}
            <div className="flex justify-center items-center gap-3">
              <Badge variant={testimonial?.status === "approved" ? "default" : "secondary"}>
                {testimonial?.status}
              </Badge>
              <Badge variant="outline">Order  Number: {testimonial?.order}</Badge>
            </div>

            {/* Dates */}
            <div className="text-xs text-muted-foreground text-center mt-2">
              Created: {new Date(testimonial?.createdAt).toLocaleDateString()}
            </div>
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground">No testimonial found.</p>
        )}
      </DialogContent>
    </Dialog>




    )


}


export default TestimonialDetailModal





