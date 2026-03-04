'use client'

import { Typograph } from "@/ui/typograph"
import { Carousel } from "react-glide-carousel"
import { Project } from "@/lib/types"

export const DesignStrategy = ({ project }: { project: Project }) => {
    return (
        <div className='flex h-[400px] flex-row gap-5 mt-40'>

            <div className="w-1/3 h-full flex flex-col gap-3 bg-gray-300 p-10">
                <Typograph variant="tittle">Design Strategy</Typograph>
                <Typograph >
                    {project.design_strategy}
                </Typograph>
            </div>
            {/* <Carousel items={project.image}/> */}
            <div className="w-2/3 h-full">
                <Carousel
                    items={project.image}
                    autoPlay
                    interval={5000}
                    className="w-full h-full"
                />
            </div>
        </div>
    )
}