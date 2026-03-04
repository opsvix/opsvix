"use client";

import { useContact } from "@/context/ContactContext";
import { Navigation } from "@/layout/Navigation";
import { ContactPopup } from "@/components/ContactPopup";

export function RootLayoutContent({ children }: { children: React.ReactNode }) {
    const { isOpen, closeContact } = useContact();
    return (
        <>
            {children}
            <Navigation />
            <ContactPopup isOpen={isOpen} onClose={closeContact} />
        </>
    );
}
