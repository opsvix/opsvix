interface Props {
   indicatorStyle: {
      left: number;
      width: number;
      opacity: number;
   };
}

export default function SelectionIndicator({ indicatorStyle }: Props) {
   return (
      <div
         className="absolute hidden md:block h-[calc(100%-4px)] -top-0.8 bg-gray-200/20 rounded-2xl transition-all duration-300 ease-in-out border border-white shadow-[0px_0px_10px_rgba(0,0,0,0.1)] inset-shadow-[0_0_20px] inset-shadow-white z-0"
         style={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
            opacity: indicatorStyle.opacity,
         }}
      />
   )
}