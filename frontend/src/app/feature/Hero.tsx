'use client'
import { Typograph } from "@/ui/typograph";
import { useGSAP } from "@gsap/react";
import gsap, { ScrollTrigger } from "gsap/all";
import React, { useRef } from "react";

type Props = {};

const Hero = (props: Props) => {
  const contain = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      if (!contain.current) return;

      const triggerConfig = {
        trigger: document.documentElement,
        start: "top top",
        end: "40% top",
        scrub: true,
      };

      // Scale main container
      gsap.to(contain.current, {
        scale: 0.96,
        scrollTrigger: triggerConfig,
      });

      // Scale gradient at the same time
      gsap.to(".gradient", { scale: 1.2, scrollTrigger: triggerConfig });
    },
    { scope: contain }
  );

  return (
    <div className="w-full h-screen p-5 fixed overflow-hidden">
      <div
        ref={contain}
        className="h-full rounded-4xl inset-shadow-[0_0_100px] inset-shadow-blue-100 border border-blue-200 bg-linear-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center overflow-hidden "
      >
        <Typograph variant="heading" className="h-fit">
          We shape brand identities <br /> and narratives
        </Typograph>
        <div className="flex gap-2">
          <p className="bg-blue-50 text-blue-500 px-2 py-1 text-sm text-center mt-5">
            Product Development
          </p>
          <p className="bg-pink-50 text-pink-500 px-2 py-1 text-sm text-center mt-5">
            AI Systems
          </p>
          <p className="bg-violet-50 text-violet-800 px-2 py-1 text-sm text-center mt-5">
            AI Automation Infasturcture
          </p>
        </div>
        <div className="gradient bg-[#6CA4FF] absolute  -translate-y-7/12 top-0  right-1/2 translate-x-1/2 w-225 rounded-full h-96 blur-3xl"></div>
        <div className="gradient bg-[#0F31AF] absolute  -translate-y-8/12 top-0  left-1/3 w-125 rounded-full h-96 blur-3xl"></div>
      </div>
    </div>
  );
};

export default Hero;
