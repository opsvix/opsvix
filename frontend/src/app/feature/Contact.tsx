'use client'
import { useContact } from "@/context/ContactContext";
import { Button } from "@/ui/button";
import { Typograph } from "@/ui/typograph";

const Contact = () => {
  const { openContact } = useContact();

  return <div className="w-full h-full flex flex-col items-center justify-center gap-10">
    <Typograph variant="heading">
      <br />
    </Typograph>
    <Typograph variant="heading" className="text-5xl h-fit text-shadow-[#8FDDFF] text-blue-800 text-shadow-[0px_0px_5px_rgba(255,255,255,1)] leading-[1.2]  ">
      Tell us about your<span className="font-merriweather"> Organisation </span>
      <br />  <span className="font-merriweather italic text-5xl"> Let&apos;s drive </span> &nbsp;to the Impact
    </Typograph>
    <Button onClick={openContact} >Get in Touch</Button>
  </div>;
};

export default Contact;
