'use client'
import React, { useState } from "react";
import { ContactPopup } from "@/components/ContactPopup";
import { Button } from "@/ui/button";
import { Typograph } from "@/ui/typograph";

const Contact = () => {
  const [isOpen, setIsOpen] = useState(false);

  return <div className="w-full h-full py-60 flex flex-col items-center justify-center gap-10">
    <Typograph variant="heading">
      Tell us about your organisation <br /> Let's drive to the Impact
    </Typograph>
    <Button onClick={() => setIsOpen(true)} >Get in Touch</Button>
    <ContactPopup isOpen={isOpen} onClose={() => setIsOpen(false)} />
  </div>;
};

export default Contact;
