export default function TokensLoading() {
  return (
    <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-50 overflow-y-auto">
      <div className="relative bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100/50">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-50/30 to-transparent"></div>
        <div className="relative p-4 lg:p-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-8 bg-gray-200 rounded-lg w-48 mb-2 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded-lg w-64 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-8 space-y-6 lg:space-y-8">
        {/* Loading Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm border border-gray-100/50">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gray-200 rounded-2xl animate-pulse"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Loading Top-up Section */}
        <div className="bg-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100/50">
          <div className="h-6 bg-gray-200 rounded w-32 mb-6 animate-pulse"></div>
          <div className="flex flex-col lg:flex-row gap-6 lg:items-end">
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded-2xl animate-pulse"></div>
            </div>
            <div className="h-12 bg-gray-200 rounded-2xl w-48 animate-pulse"></div>
          </div>
        </div>

        {/* Loading Table */}
        <div className="bg-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100/50">
          <div className="h-6 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
