"use client";

import React, { useState, useEffect } from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MessageSquare } from "lucide-react";
import Image from "next/image";
import PropertySlider from "@/src/components/Property/Image-Slider/slider";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation"
import { getPropertyById } from "@/src/services/propertyService";
import { Eye, ArrowLeft } from "lucide-react";
import LoadingIndicator from "@/src/common/LoadingIndicator/loading";
import { commingSoon } from "@/src/common/common";
import UpdatePropertyModal from "@/src/components/Property/UpdatePropertyModal/UpdatePropertyModal";
import { useRouter } from "next/navigation";



interface PropertyDetail {
    title: string;
    location: string;
    images: string[];
    bedrooms?: number;
    bathrooms?: number;
    size?: string | number;
    specifications?: string;
    category?: string;
    floor?: number;
    furnishingStatus?: string;
    launchPrice?: number;
    handOverPrice?: number;
    serviceCharges?: number;
    type?: string;
    availabilityStatus?: string;
    createdAt?: string;
    description?: string;
    amenities?: string[];
    nearby?: string[];
    status?: string;
    mwVerified?: string;
    reraId?: string;
    videos?: string[];
    city?: string;
    country?: string;
    zipcode?: number;
}


const SinglePropertyPage = () => {
    const router = useRouter();

    const params = useParams();
    const id = params?.id as string;


    const { data: property, isLoading, isError } = useQuery({
        queryKey: ["property", id],
        queryFn: () => getPropertyById(id),
        enabled: !!id,
    });

    const propertyDetail = property?.data?.property as PropertyDetail;



    const [selectedImageIndex, setSelectedImageIndex] = useState(0);


    useEffect(() => {
        if (propertyDetail?.images?.length > 0) {
            const interval = setInterval(() => {
                setSelectedImageIndex((prevIndex) =>
                    (prevIndex + 1) % propertyDetail.images.length
                );
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [propertyDetail?.images?.length]);

    if (isLoading)
        return (
            <div className="flex items-center justify-center h-[70vh]">
                <LoadingIndicator />
            </div>

        );

    if (isError || !property) return <p>Failed to load property details.</p>;

    const selectedImage = propertyDetail?.images?.[selectedImageIndex];








    return (
        <div className="max-w-6xl mx-auto p-4 space-y-6">
            <Button
                variant="outline"
                onClick={() => router.back()}
                className="mb-4 flex items-center gap-2"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Properties
            </Button>
            {propertyDetail?.images?.length > 0 &&
                <PropertySlider propertyDetail={propertyDetail} />
            }

                


            {/* Features with Icons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* <Card>
                    <CardContent className="p-4 text-center">
                        <p className="font-semibold">Bedrooms</p>
                        <p>{propertyDetail?.bedrooms}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="font-semibold">Bathrooms</p>
                        <p>{propertyDetail?.bathrooms}</p>
                    </CardContent>
                </Card> */}
                {/* <Card>
                    <CardContent className="p-4 text-center">
                        <p className="font-semibold">Area (sqft)</p>
                        <p>{propertyDetail?.area}</p>
                    </CardContent>
                </Card> */}
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="font-semibold">Property Type</p>
                        <p>{propertyDetail?.type}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Thumbnails (optional) */}

            {propertyDetail?.images?.length > 0 &&
                <div className="flex gap-2 justify-center">
                    {propertyDetail?.images?.map((img, index) => (
                        <div
                            key={img}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`w-24 h-16 rounded overflow-hidden cursor-pointer border-2 ${selectedImageIndex === index
                                ? "border-primary"
                                : "border-transparent"
                                }`}
                        >
                            <Image
                                src={img}
                                alt={`Thumbnail ${index}`}
                                width={100}
                                height={100}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    ))}
                </div>
            }


            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="status">Booking & Activity</TabsTrigger>
                    <TabsTrigger value="media">Media & Documents</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <h2 className="text-2xl font-bold mt-6 mb-2">🏠 {propertyDetail?.title}</h2>
                    <p className="text-muted-foreground mb-4 italic">{propertyDetail?.location?.address}, {propertyDetail?.location?.city}, {propertyDetail?.location?.state}, {propertyDetail?.location?.zipCode}</p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div><strong>🛏 Bedrooms:</strong> {propertyDetail?.bedrooms}</div>
                        <div><strong>🛁 Bathrooms:</strong> {propertyDetail?.bathrooms}</div>
                        <div><strong>📐 Size:</strong> {propertyDetail?.area} sqft</div>
                        <div><strong>🏷 Gender:</strong> {propertyDetail?.gender}</div>
                        <div><strong>🏬 Bulk Accomodation:</strong> {propertyDetail?.bulkAccommodation == true ? "Allowed" : "Not Allowed"}</div>
                        {/* <div><strong>🪑 Furnishing:</strong> {propertyDetail?.furnishingStatus}</div> */}
                        <div><strong>👥 Bulk Accommodation:</strong> {propertyDetail?.bulkAccommodationType?.join(', ') || 'N/A'}</div>

                        <div><strong>💰 Price:</strong> ${propertyDetail?.price}</div>
                        <div><strong>🤝 Sharing Type:</strong> {propertyDetail?.sharingType?.join(', ') || 'N/A'}</div>

                        {/* <div><strong>🧾 Views:</strong> ${propertyDetail?.views}</div> */}
                        <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4 text-muted-foreground" />
                            <strong>Views:</strong> {propertyDetail?.views ?? 0}
                        </div>

                        <div><strong>🔖 Type:</strong> {propertyDetail?.type}</div>
                        <div><strong>📅 Availability:</strong> {propertyDetail?.isAvailable == true ?
                            "Availabele" : "Not Available"
                        }</div>
                        <div>
                            <strong>📆 Created At:</strong>{" "}
                            {propertyDetail?.createdAt
                                ? new Date(propertyDetail.createdAt).toLocaleDateString()
                                : "N/A"}
                        </div>

                    </div>

                    <Separator className="my-6" />

                    <h3 className="text-xl font-semibold mb-2">📄 Description</h3>
                    <p className="text-muted-foreground">{propertyDetail?.description}</p>

                    <Separator className="my-6" />

                    <h3 className="text-xl font-semibold mb-2">🏞 Amenities</h3>
                    <ul className="list-disc list-inside grid grid-cols-2 gap-x-4">
                        {propertyDetail?.amenities?.map((a, i) => (
                            <li key={i} className="text-muted-foreground">{a}</li>
                        ))}
                    </ul>

                    <Separator className="my-6" />

                    <h3 className="text-xl font-semibold mb-2">📍 Nearby Places</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                        {propertyDetail?.nearbyPlaces?.length > 0 ? (
                            propertyDetail.nearbyPlaces.map((place) => (
                                <div key={place._id} className="p-2 border rounded shadow-sm">
                                    <strong>{place.type}</strong>: {place.name} ({place.distance} km)
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No nearby places available.</p>
                        )}
                    </div>
                    <Separator className="my-6" />

                    <h3 className="text-xl font-semibold mb-2">📌 Rules</h3>
                    <ul className="list-disc list-inside text-muted-foreground grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {propertyDetail?.rules?.length > 0 ? (
                            propertyDetail.rules.map((rule, index) => (
                                <li key={index}>{rule}</li>
                            ))
                        ) : (
                            <p className="text-gray-500 col-span-full">No rules specified.</p>
                        )}
                    </ul>


                    <Separator className="my-6" />

                    <h3 className="text-xl font-semibold mb-2">🗺 Map View</h3>
                    {propertyDetail.location ? (
                        <iframe
                            src={`https://www.google.com/maps?q=${encodeURIComponent(propertyDetail.location?.city)}&output=embed`}
                            className="w-full h-64 rounded-lg border"
                            loading="lazy"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <p className="text-muted-foreground">Map not available</p>
                    )}

                </TabsContent>

                <TabsContent value="status">
                    <h3 className="text-xl font-semibold mb-2">📈 Booking & Activity</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><strong>Views:</strong> {propertyDetail?.views}</div>
                        <div className="flex items-center gap-2 text-sm">
                            <strong>⭐ Rating:</strong>
                            <span>{propertyDetail?.rating?.average ?? 0} / 5</span>
                            <span className="text-muted-foreground">({propertyDetail?.rating?.count ?? 0} reviews)</span>
                        </div>
                        <div><strong>Schedule Visit:</strong> ---</div>
                        <div><strong>Visit Booking:</strong> ---</div>
                    </div>
                </TabsContent>

                <TabsContent value="media">
                    <h3 className="text-xl font-semibold mb-2">🖼 Images</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {propertyDetail?.images?.map((img, i) => (
                            <Image
                                key={i}
                                src={img}
                                width={400}
                                height={300}
                                alt={`Property Image ${i}`}
                                className="rounded-lg shadow-md"
                            />
                        ))}
                    </div>

                    <h3 className="text-xl font-semibold mt-6 mb-2">🎬 Videos</h3>
                    {(propertyDetail?.videos?.length ?? 0) > 0 ? (
                        propertyDetail.videos!.map((vid, i) => (
                            <video key={i} controls className="w-full mt-2 rounded-md">
                                <source src={vid} type="video/mp4" />
                            </video>
                        ))
                    ) : (
                        <p className="text-muted-foreground">No videos available.</p>
                    )}

                </TabsContent>

            </Tabs>



        </div >


    )


}


export default SinglePropertyPage