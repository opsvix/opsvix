import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

interface Props {
    menuOpen: boolean;
    navItems: { id: string; label: string; href: string }[];
    handleNavClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string, id: string) => void;
    setMenuOpen: (open: boolean) => void;
}

const itemVariants = {
  hidden: { opacity: 0, filter: "blur(10px)", scale: 0.5 },
  visible: (i: number) => ({
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    transition: { delay: 0.2 + i * 0.1, duration: 0.3 },
  }),
};



export const MobNav = ({ menuOpen, navItems, handleNavClick, setMenuOpen }: Props) => {
    return (
        <AnimatePresence>
            {menuOpen && (
                <motion.ul className="md:hidden mt-4 flex items-center flex-col  gap-5 w-full px-6 absolute top-10">
                    {navItems.map((item, index) => (
                        <motion.li
                            key={item.id}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            custom={index}
                            exit="hidden"
                            className="cursor-pointer hover:text-blue-600 font-medium"
                        >
                            <Link
                                href={item.href}
                                onClick={(e) => {
                                    handleNavClick(e, item.href, item.id);
                                    setMenuOpen(false);
                                }}
                            >
                                {item.label}
                            </Link>
                        </motion.li>
                    ))}
                </motion.ul>
            )}
        </AnimatePresence>
    )
}