
const Grid = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="  w-full grid grid-cols-3 gap-5 gap-y-15 ">
      {children}
    </div>
  );
};

export default Grid;