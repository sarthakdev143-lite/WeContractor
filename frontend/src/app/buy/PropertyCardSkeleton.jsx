const PropertyCardSkeleton = ({ index }) => {
  return (
    <div className="w-full sm:w-[45%] lg:w-[30%] h-fit animate-pulse" key={index}>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        {/* Image skeleton */}
        <div className="h-48 sm:h-64 md:h-72 bg-gray-200" />

        {/* Content skeleton */}
        <div className="p-4 space-y-3">
          {/* Title and views */}
          <div className="flex justify-between items-start">
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-16" />
          </div>

          {/* Description lines */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>

          {/* Location */}
          <div className="h-5 bg-gray-200 rounded w-1/2" />

          {/* Details Grid */}
          <div className="flex gap-2">
            <div className="h-16 bg-gray-200 rounded flex-grow" />
            <div className="h-16 bg-gray-200 rounded flex-grow" />
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-2">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCardSkeleton;