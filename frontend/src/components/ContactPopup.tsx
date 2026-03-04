"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/ui/button";
import { Typograph } from "@/ui/typograph";

interface ContactPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactPopup({ isOpen, onClose }: ContactPopupProps) {
 
 

    
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 p-4"
          >
            <div className="bg-white  relative flex w-[1000px] max-w-[95vw] h-[600px] max-h-[90vh] overflow-hidden">
              <div className="w-1/2 h-full bg-linear-to-b from-[#0F31AF] to-[#00112e] flex flex-col justify-center">
                <Typograph variant="heading" className="text-white text-start p-8 pt-0!">
                  From Routine checkups to Edge cases - We&apos;re  With You
                  <span className="font-merriweather italic"> Every Step </span>  
                </Typograph>
              </div>

              <div className="w-1/2 h-full p-8 relative">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="absolute top-4 right-4 text-black rounded-full border border-gray-300 h-10 w-10 flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </Button>
                {/* Form placeholder can go here */}
                <Typograph variant="heading" className="text-black text-start">
                  Can we take the first step<span className="font-merriweather italic text-5xl">Together </span>  
                </Typograph>
                <Typograph className="text-black text-start pt-5">
                  Let&apos;s Create Something Extraordinary
                </Typograph>
                <form className="flex flex-col gap-5 mt-5">
                  <input type="text" placeholder="Name" className="text-black border border-gray-300 p-2" />
                  <input type="email" placeholder="Email" className="text-black border border-gray-300 p-2" />
                  <input type="text" placeholder="Message" className="text-black border border-gray-300 p-2 h-20" />
                  <div className="flex justify-end">
                    <button type="submit" className="w-fit text-white bg-black p-2 px-8">Connect</button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
