import Image from "next/image";
import Hero from "./feature/Hero";
import About from "./feature/About";
import Contact from "./feature/Contact";
import Services from "./feature/Services";
import CustomLayout from "@/layout/CustomLayout";

export default function Home() {
  return (
    <div className="  bg-zinc-50 font-sans ">
      <Hero />
      <div className="h-screen w-full"></div>
      <CustomLayout className="bg-[#fcfcfc] ">
        <About />
        <Services />
        <Contact />
      </CustomLayout>
    </div>
  );
}
