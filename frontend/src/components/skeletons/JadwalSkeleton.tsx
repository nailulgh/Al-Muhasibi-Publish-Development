export function JadwalSkeleton() {
    return (
        <div className="flex flex-col animate-pulse">
            {/* Hero Skeleton */}
            <div className="relative h-[40vh] bg-gray-300 dark:bg-gray-700 w-full mb-16 md:mb-20"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Filter Skeleton */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-12">
                    <div className="h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-8 w-24 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                        ))}
                    </div>
                </div>

                {/* Counter Skeleton */}
                <div className="mx-auto w-64 h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl mb-12"></div>

                {/* Table/List Skeleton */}
                <div className="space-y-4">
                    {/* Desktop Table Header */}
                    <div className="hidden md:block h-12 bg-gray-300 dark:bg-gray-700 rounded-t-xl"></div>

                    {/* Rows */}
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-16 bg-gray-200 dark:bg-gray-800 rounded-xl md:rounded-none"></div>
                    ))}
                </div>
            </div>
        </div>
    )
}
