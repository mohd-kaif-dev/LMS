const ImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-blue-400/50 p-12 m-8 rounded-3xl">
      <div className="flex flex-col items-center justify-center">
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`h-20 w-20 rounded-2xl bg-blue-700/90 ${
                i % 2 === 0 ? "animate-pulse" : ""
              }`}
            />
          ))}
        </div>
        <h2 className="text-3xl font-bold text-black text-center">{title}</h2>
        <p className="text-lg text-zinc-700 text-center">{subtitle}</p>
      </div>
    </div>
  );
};

export default ImagePattern;
