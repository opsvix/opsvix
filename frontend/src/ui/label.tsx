export const Label = ({ text }: { text: string }) => {
  return (
    <p className="bg-gray-50 text-gray-500 border border-gray-200 rounded-full px-3 py-1 text-sm text-center cursor-pointer">
      {text}
    </p>
  )
}