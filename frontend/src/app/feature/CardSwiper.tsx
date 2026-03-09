"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";
import "./CardSwiper.css";
import "swiper/css";
import "swiper/css/effect-cards";
import { Project } from "@/lib/types";
import Image from "next/image";
import { Label } from "@/ui/label";
import BlurEffect from "react-progressive-blur";

export default function CardSwiper({ projects }: { projects: Project[]  }) {
    return (
        <div  style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Swiper
                effect="cards"
                grabCursor={true}
                modules={[EffectCards]}
                className="mySwiper"
                style={{ width: "280px", height: "360px" }}
                loop={true}
            >
                {projects.map((project) => (
                    <SwiperSlide
                        key={project.id}
                        className="h-full w-full border border-gray-300 flex items-center justify-center rounded-xl" 
                        style={{

                            fontSize: "22px",
                            fontWeight: "bold",
                            color: "#fff",
                        }}
                    >
                        <Card project={project} />
                     
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}


const Card = ({ project }: { project: Project }) => {
    return (
        <div className={ `${project.color} w-full h-full py-10 relative flex items-center`}>
            <div className="flex justify-between flex-col absolute top-0 left-0 w-full h-full p-2.5 py-3 pb-5 z-20">
                <div className="w-full flex flex-wrap gap-1.5">
                {project.services.map((service, index) => (
                    <Label key={index} text={service} size="xs" textColor={project.textColor??project.textColor} />
                ))}
                </div>
            <p className={`text-black text-base z-20 font-medium font-telegraf px-2 w-full ${project.textColor}`}>{project.title}</p>
            </div>


            <Image src={project.image[0]} alt={project.title} width={240} height={320} className="h-full w-full object-cover" />

            <BlurEffect
            className="h-20 bg-linear-to-b from-black/20 to-transparent"
            intensity={100}
            position="top"
          />
            <BlurEffect
            className="h-20 w-full bg-linear-to-t from-black/20 to-transparent"
            intensity={200}
            position="bottom"
          />
        </div>
    );
}