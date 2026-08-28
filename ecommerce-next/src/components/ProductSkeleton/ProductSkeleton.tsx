export const ProductSkeleton = () => {
  return (
    <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/5 shadow-xl animate-pulse">
      <div className="aspect-video bg-white/5" />

      <div className="p-5">
        <div className="h-6 bg-white/10 rounded-md w-3/4 mb-4" />

        <div className="flex justify-between items-center mt-4">
          <div className="flex flex-col gap-2">
            <div className="h-2 bg-white/5 rounded w-10" />
            <div className="h-8 bg-white/10 rounded w-16" />
          </div>

          <div className="h-10 bg-white/10 rounded-xl w-24" />
        </div>
      </div>
    </div>
  );
};
