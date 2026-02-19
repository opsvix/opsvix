import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

interface Props {
    menuOpen: boolean;
    navItems: any[];
    itemVariants: any;
    handleNavClick: any;
    setMenuOpen: any;
}

export const MobNav = ({ menuOpen, navItems, itemVariants, handleNavClick, setMenuOpen }: Props) => {
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