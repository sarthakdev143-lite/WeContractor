export const PlotSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-blue-50 flex justify-center p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-[128rem] bg-white rounded-xl shadow-lg h-fit overflow-hidden animate-pulse">
            <div className="grid md:grid-cols-2 gap-6 p-4 sm:p-6 md:p-8 lg:p-12">
                {/* Image Gallery Skeleton */}
                <div className="space-y-4">
                    <div className="w-full aspect-[4/3] bg-gray-200 rounded-lg"></div>
                    <div className="flex space-x-2 overflow-x-auto">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-md flex-shrink-0"></div>
                        ))}
                    </div>
                </div>

                {/* Details Skeleton */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="h-8 bg-gray-200 rounded-md w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
                    </div>
                    <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="w-4 h-4 bg-gray-200 rounded-full"></div>
                        ))}
                    </div>
                    <div className="h-24 bg-gray-200 rounded-lg"></div>
                    <div className="grid sm:grid-cols-2 gap-3">
                        <div className="h-16 bg-gray-200 rounded-lg"></div>
                        <div className="h-16 bg-gray-200 rounded-lg"></div>
                    </div>
                    <div className="h-32 bg-gray-200 rounded-lg"></div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="h-12 bg-gray-200 rounded-lg"></div>
                        <div className="h-12 bg-gray-200 rounded-lg"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);