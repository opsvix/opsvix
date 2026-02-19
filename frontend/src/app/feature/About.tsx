"use client";
import TextOpacityOnScroll from "@/ui/scroll-text";
import React, { useRef } from "react";
import trustedleft from "../../../public/logos/trustedleft.svg"
import trustedright from "../../../public/logos/trustedright.svg"
import Image from "next/image";
import mapmyproperty from "../../../public/logos/mapmyproperty.png"
import reddotconsltency from "../../../public/logos/mapmyproperty.png"
import pertyai from "../../../public/logos/mapmyproperty.png"

const companies = [mapmyproperty, reddotconsltency, pertyai, mapmyproperty, mapmyproperty, mapmyproperty];
type Props = {};

const About = (props: Props) => {
  const contain = useRef<HTMLDivElement | null>(null);
  return (
    <div
      className="w-full h-screen relative z-20 flex flex-col items-center justify-center px-20 max-w-7xl mx-auto border-t-2 border-gray-200  bg-dot-8-s-2-neutral-200/50"
      ref={contain}
    >
      <TextOpacityOnScroll
        className="w-full h-full flex items-center justify-center text-black text-2xl md:text-4xl lg:text-5xl font-extralight  text-center"
        contain={contain}
        phrase="Opsvix Solutions partners with global companies to design, build, and
        scale digital products through strong engineering, practical AI, and
        reliable cloud systems."
      />
      <Carousel />
      <div className="w-full h-40 xl:h-60 flex ">

      </div>
    </div>
  );
};

export default About;


export const Carousel = () => {
  return (
    <div className="flex flex-row w-full h-fit     overflow-hidden items-center justify-between pointer-events-none md:pointer-events-auto select-none">

      <div className="flex flex-row items-center gap-3 shrink-0 z-10 bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/10 pr-6">
        <Image src={trustedleft} alt="Trusted Left" width={35} height={35} priority />
        <p className="text-center text-[#8D8D8D] text-xs md:text-sm leading-tight">
          Trusted by 35+<br /> organisations
        </p>
        <Image src={trustedright} alt="Trusted Right" width={35} height={35} priority />
      </div>

      <div
        className="flex relative overflow-hidden w-full ml-4 md:ml-0 mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
      >
        <div className="flex flex-row animate-scroll hover:[animation-play-state:paused] w-max">
          {[...companies, ...companies].map((logo, index) => (
            <div key={index} className="relative w-72 h-20 mr-12 md:mr-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 transform hover:scale-110 cursor-pointer">
              <Image src={logo} alt={`Logo ${index}`} className="object-contain w-full h-full" width={300} height={300} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


