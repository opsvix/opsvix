"use client";
import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Navigation } from "./Navigation";

type Props = {
  children: React.ReactNode;
  className?: string;
};

gsap.registerPlugin(ScrollTrigger);

const CustomLayout = ({ children, className }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
    };
  }, []);

  useGSAP(
    () => {
      if (scrollRef.current) {
        const boxes = gsap.utils.toArray(
          scrollRef.current.children,
        ) as HTMLElement[];
        boxes.forEach((box) => {
          gsap.from(box, {
            y: 80,
            scale: 1,
            scrollTrigger: {
              trigger: box,
              start: "top bottom",
              end: "top 70%",
              scrub: true,
            },
            ease: "power1.inOut",
          });
        });
      }
    },
    { scope: scrollRef },
  );

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: [0.43, 0.13, 0.23, 0.96], duration: 0.3 }}
      ref={ref}
      className={cn(" relative ", className)}
    >
      {children}
      {/* <div className="fixed top-0 left-0 w-full opacity-50 bg-white h-screen z-50 mask-[linear-gradient(to_bottom,black_0.1%,transparent,transparent,black_99.99%)]">c</div> */}
    </motion.main>
  );
};

export default CustomLayout;
