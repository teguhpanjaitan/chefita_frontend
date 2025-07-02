export default function Loading() {
  return (
    <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-50 overflow-y-auto">
      {/* Header Skeleton */}
      <div className="relative bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100/50">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-50/30 to-transparent"></div>
        <div className="relative p-4 lg:p-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-8 bg-gray-200 rounded-lg w-80 mb-2 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded-lg w-96 animate-pulse"></div>
            </div>
            <div className="hidden md:block">
              <div className="h-6 bg-gray-200 rounded w-32 mb-1 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-40 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-8 space-y-6 lg:space-y-8">
        {/* Filter Controls Skeleton */}
        <div className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm border border-gray-100/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="h-20 bg-gray-200 rounded-2xl animate-pulse"></div>
            <div className="h-20 bg-gray-200 rounded-2xl animate-pulse"></div>
            <div className="h-20 bg-gray-200 rounded-2xl animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded-2xl animate-pulse"></div>
          </div>
        </div>

        {/* Summary Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm border border-gray-100/50">
              <div className="h-4 bg-gray-200 rounded w-24 mb-3 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm border border-gray-100/50">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
            <div className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
          <div className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm border border-gray-100/50">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-200 rounded-xl animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="bg-white rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100/50 overflow-hidden">
          <div className="p-4 lg:p-6 border-b border-gray-100">
            <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
          <div className="p-6 space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
