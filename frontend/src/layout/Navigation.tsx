"use client";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import { ContactPopup } from "@/components/contact-popup";
import { Mail } from "lucide-react";
import MenuIcon from "@/ui/icon-menu";
import { ContactPopup } from "@/components/ContactPopup";
import { MobNav } from "./nav-footer/MobNav";
import SelectionIndicator from "./nav-footer/SelectionIndicator";

const navItems = [
  { id: "home", label: "Home", href: "/" },
  { id: "portfolio", label: "Portfolio", href: "/portfolio" },
  { id: "services", label: "Services", href: "/services" },
  { id: "career", label: "Career", href: "/support" },
  { id: "connect", label: "Connect", href: "/#about" },
];

const menuVariants = {
  nav: {
    height: "3.5rem",
    borderRadius: "19px",
  },
  footer: {
    height: "18rem",
    borderRadius: "19px",
    width: "100%",
    marginLeft: "80px",
    marginRight: "80px",
  },
};

const itemVariants = {
  hidden: { opacity: 0, filter: "blur(10px)", scale: 0.5 },
  visible: (i: number) => ({
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    transition: { delay: 0.2 + i * 0.1, duration: 0.3 },
  }),
};

export function Navigation() {
  const [activeItem, setActiveItem] = useState("home");
  const [menuOpen, setMenuOpen] = useState(true);
  const [contactPopupOpen, setContactPopupOpen] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });
  const itemRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});
  const pathname = usePathname();

  // Update active item based on pathname path
  useEffect(() => {
    if (pathname === "/packages") setActiveItem("packages");
    else if (pathname === "/support") setActiveItem("support");
    else if (pathname === "/about") setActiveItem("about");
    else if (pathname === "/") {
      setActiveItem("home");
    }
  }, [pathname]);

  // Update indicator position when activeItem changes
  useEffect(() => {
    const activeElement = itemRefs.current[activeItem];
    if (activeElement) {
      setIndicatorStyle({
        left: activeElement.offsetLeft,
        width: activeElement.offsetWidth,
        opacity: 1,
      });
    }
  }, [activeItem]);

  // Intersection Observer for scroll detection on home page
  useEffect(() => {
    // Only run on home page
    if (pathname !== "/") return;

    const sections = document.querySelectorAll("section[id]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const sectionId = entry.target.getAttribute("id");
            if (sectionId && navItems.some((item) => item.id === sectionId)) {
              setActiveItem(sectionId);
            }
          }
        });
      },
      {
        threshold: [0.5], // Trigger when 50% of section is visible
        rootMargin: "-100px 0px -100px 0px", // Account for navbar height
      },
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, [pathname]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Handle smooth scroll for anchor links
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    id: string,
  ) => {
    // Only handle hash links on the home page
    if (href.startsWith("/#") && pathname === "/") {
      e.preventDefault();
      const sectionId = href.replace("/#", "");
      const section = document.getElementById(sectionId);

      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveItem(id);
        // Update URL hash without jumping
        window.history.pushState(null, "", href);
      }
    } else if (href === "/" && pathname === "/") {
      // Scroll to top on home page
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActiveItem("home");
    } else {
      // Let Next.js handle normal navigation
      setActiveItem(id);
    }
  };

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed bottom-5 left-0 right-0 z-50 p-4"
    >
      <div className="flex  items-center justify-center md:max-w-7xl mx-auto">
        <motion.nav
          variants={menuVariants}
          animate={!menuOpen ? "footer" : "nav"}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="w-full h-14  md:w-auto bg-[#5f7084]/10 backdrop-blur-3xl border border-white rounded-full px-1.5 py-1 shadow-[0px_0px_30px_rgba(0,0,0,0.06)]  inset-shadow-[0_0_20px] inset-shadow-white"
        >
          <div className="flex justify-between  items-center gap-1 relative ">

            {!menuOpen && (
              <div>
                <div className="flex flex-row gap-3">
                  <p className="text-black">Services</p>
                  <p className="text-black">About</p>
                  <p className="text-black">Contact</p>
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-black">Services</p>
                  <p className="text-black">Web Development</p>
                  <p className="text-black">Cloud & DevOps</p>
                  <p className="text-black">AI & ML</p>
                  <p className="text-black">Data Analytics</p>
                </div>
              </div>
            )}
            <SelectionIndicator indicatorStyle={indicatorStyle} />

            {navItems.map((item) => (
              <Link
                key={item.id}
                ref={(el) => {
                  itemRefs.current[item.id] = el;
                }}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href, item.id)}
                className={`hidden md:block relative px-6 py-3 text-sm font-medium transition-colors duration-200 z-10 ${activeItem === item.id
                  ? "text-gray-800" // active text color
                  : "text-gray-500 hover:text-[#5C82A3]"
                  }`}
              >
                {item.label}
              </Link>
            ))}
            <MobNav menuOpen={menuOpen} navItems={navItems} itemVariants={itemVariants} handleNavClick={handleNavClick} setMenuOpen={setMenuOpen} />

            <MenuIcon toggle={toggleMenu} open={menuOpen} />
          </div>
        </motion.nav>
      </div>
    </motion.div>
  );
}





{/* Contact Button */ }
{/* <button
              onClick={() => setContactPopupOpen(true)}
              className="hidden md:flex items-center gap-2 mr-0.5 px-5 py-2 bg-[#5C82A3] text-white rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors border-2 border-black  hover:translate-y-0.5 z-20"
            >
              <Mail className="w-4 h-4" />
              Contact Us
            </button> */}


{/* <Link
              href="/"
              className="flex items-center gap-2 px-5 cursor-pointer z-20"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                <Image
                  src="/logos/logo.svg"
                  alt="logo"
                  width={32}
                  height={32}
                />
              </div>
              <span className="font-bold text-lg">Digital Mitra</span>
            </Link> */}