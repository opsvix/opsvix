import Grid from '@/components/PortfolioGrid';
import Card from '@/components/projectCard';
import CustomLayout from '@/layout/CustomLayout';
import { projects } from '@/lib/data';
import React from 'react'

const PortfolioPage = () => {

    return (
        <CustomLayout>
            <div className="w-full h-full px-20 2xl:px-40 mx-auto bg-[#fcfcfc]   ">
                <p className="text-4xl text-center pt-20 bg-clip-text text-transparent bg-linear-to-r to-[#00003E] from-[#0000A4] bg-clip leading-tight ">Stories That Help <br /> Our Services Flourish</p>
                <p className="text-center text-gray-500 pt-5 pb-20 2xl:pb-30 w-1/3 mx-auto">Showcasing the ideas and outcomes behind what we do. Where creativity meets purpose and performance</p>
                <Grid>
                    {projects.map((project) => (
                        <Card key={project.id} project={project} />
                    ))}
                </Grid>
                <p className='text-center text-gray-500   py-20 2xl:py-30 w-1/3 mx-auto'>You're reached the end</p>
            </div >
        </CustomLayout>
    )

}

export default PortfolioPage