"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css";

import Image from "next/image";
interface PropertyDetail {
    title: string;
    location: string;
    images: string[];
}

type PropertySliderProps = {
    propertyDetail: PropertyDetail;
};


export default function PropertySlider({ propertyDetail }: PropertySliderProps) {

    const propertyImages = propertyDetail?.imagesreturn (
        <div className="max-w-6xl mx-auto p-4 space-y-6">
            <Swiper
                modules={[Navigation, Autoplay]}
                navigation
                autoplay={{ delay: 3000 }}
                loop={true}
                className="rounded-xl overflow-hidden"
            >
                {propertyImages?.map((img, index) => (
                    <SwiperSlide key={index}>
                        <div className="relative w-full aspect-video">
                            <Image
                                src={img}
                                alt={`Slide ${index + 1}`}
                                fill
                                className="object-cover rounded-xl"
                            />

                            <div className="absolute bottom-0 left-0 bg-black/50 w-full p-4 text-white z-10">
                                <h2 className="text-2xl font-bold">{propertyDetail?.title}</h2>
                                <p className="text-sm">{`${propertyDetail?.location?.address} ${propertyDetail?.location?.city}`}</p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>

        // <h1>Property slider</h1>
    );
}
