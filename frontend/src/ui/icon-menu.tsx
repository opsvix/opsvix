import { motion } from "framer-motion";

type Props = {
    open: boolean;
    toggle: () => void;
};

const MenuIcon = ({ toggle, open }: Props) => {
    return (
        <button
            onClick={toggle}
            className="md:hidden relative flex flex-col justify-center items-center w-[35px] h-[25px] cursor-pointer z-10 pr-5"
            aria-label="Menu Button"
        >
            <motion.span
                initial={false}
                animate={open ? { y: 0, rotate: 45 } : { y: 6, rotate: 0 }}
                transition={{ duration: 0.5, ease: [0.3, 1, 0.7, 1] }}
                className="block w-5 h-0.5 bg-gray-500 rounded-xs shadow-md absolute "
            />

            <motion.span
                initial={false}
                animate={open ? { scale: 0 } : { scale: 1 }}
                transition={{ duration: 0.5, ease: [0.3, 1, 0.7, 1] }}
                className="block w-5 h-0.5 bg-gray-500 rounded-md shadow-md absolute"
            />

            <motion.span
                initial={false}
                animate={open ? { y: 0, rotate: -45 } : { y: -6, rotate: 0 }}
                transition={{ duration: 0.5, ease: [0.3, 1, 0.7, 1] }}
                className="block w-5 h-0.5 bg-gray-500 rounded-md shadow-md absolute"
            />
        </button>
    );
};

export default MenuIcon;
