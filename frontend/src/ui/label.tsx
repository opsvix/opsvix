export const Label = ({ text , size = "sm" , textColor = 'text-gray-500'}: { text: string , size?: "xs" | "sm" , textColor?: string }) => {

  return (
    <p className={` font-medium font-telegraf bg-gray-50/20 backdrop-blur-sm ${textColor} border border-gray-200 rounded-full  text-center cursor-pointer ${size === "xs" ? "text-[11px] px-2 py-0.5 text-light" : "px-3 py-1 text-sm"}`}>
      {text}
    </p>
  )
}