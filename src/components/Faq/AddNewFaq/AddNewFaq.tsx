import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Plus,
    FolderSyncIcon as Sync,
    Upload, ImageIcon, Trash2
} from "lucide-react"

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { Schema, SchemaFormData } from "../Schema/schema"
import { useState } from "react"
import { uploadToCloudinary } from "@/lib/utils/uploadToCloudinary"
import { useRef } from "react"

type AddCityModalProps = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    onSubmit: (data: SchemaFormData, onSuccess: () => void) => void
}

const AddFaqModal = ({ open, setOpen, onSubmit }: AddCityModalProps) => {
    const {
        register, control, handleSubmit, formState: { errors, isSubmitting }, setValue, watch, reset, trigger
    } = useForm<SchemaFormData>({
        resolver: zodResolver(Schema),

        defaultValues: {
            name: "",
            type: "",
            city: "",
            area: "",
            rooms: 0,
            price: 0,
            deposit: 0,
            description: "",
            featured: false,
            amenities: [],
            bulkAccommodationType: [],
            sharingType: [],
            rules: [],
            nearbyPlaces: [], // ✅ must be array of objects



            images: [],
            isAvailable: false,  // ✅ very important
            isFeatured: false,
        },
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "nearbyPlaces",
    });

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const onFormSubmit = (data: SchemaFormData) => {
        console.log("Submitted faq", data);
        onSubmit(data, () => {
            reset();
            setOpen(false);
        });
    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Faq</DialogTitle>
                    <DialogDescription>Create a new Faq</DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                                 <form onSubmit={(e) => void handleSubmit(onFormSubmit)(e)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Input id="question" {...register("question")} placeholder="Enter your FAQ question" />
            {errors.question && <p className="text-sm text-red-500">{errors.question.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="answer">Answer</Label>
            <Textarea id="answer" {...register("answer")} placeholder="Enter answer for the FAQ" />
            {errors.answer && <p className="text-sm text-red-500">{errors.answer.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">Order</Label>
            <Input id="order" type="number" {...register("order")} placeholder="e.g. 1" />
            {errors.order && <p className="text-sm text-red-500">{errors.order.message}</p>}
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Add FAQ"}
            </Button>
          </div>
        </form>





                </div>
            </DialogContent >
        </Dialog >
    )


}


export default AddFaqModal