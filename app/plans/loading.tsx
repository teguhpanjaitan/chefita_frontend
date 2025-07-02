export default function PlansLoading() {
  return (
    <div className="space-y-8 p-6">
      {/* Header skeleton */}
      <div className="h-8 bg-gray-200 rounded-lg w-64 animate-pulse" />

      {/* Current plan skeleton */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-32" />
          <div className="h-4 bg-gray-200 rounded w-40" />
          <div className="h-4 bg-gray-200 rounded w-24" />
        </div>
        <div className="h-10 bg-gray-200 rounded-lg w-32 mt-4" />
      </div>

      {/* Plans comparison skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-24 mb-4" />
            <div className="h-8 bg-gray-200 rounded w-32 mb-6" />
            <div className="space-y-3 mb-6">
              {[1, 2, 3, 4, 5].map((j) => (
                <div key={j} className="h-4 bg-gray-200 rounded w-full" />
              ))}
            </div>
            <div className="h-12 bg-gray-200 rounded-lg w-full" />
          </div>
        ))}
      </div>

      {/* FAQ skeleton */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-64" />
          </div>
        ))}
      </div>
    </div>
  )
}
