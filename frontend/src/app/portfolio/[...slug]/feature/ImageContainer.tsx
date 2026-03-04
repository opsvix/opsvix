'use client'
import { useScroll, useTransform, motion } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';


export const ImageContainer = ({ image }: { image: string }) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref });
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

    return (
        <div className="w-full h-96 relative overflow-hidden border border-gray-300">
            <motion.div ref={ref} className="w-full h-full" style={{ scale }}>
                <Image
                    src={image}
                    alt="Project Image"
                    fill
                    className="object-cover w-full h-full"
                    priority
                />
            </motion.div>
        </div>
    );
};