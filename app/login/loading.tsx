export default function LoginLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100/30 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100/50 backdrop-blur-sm overflow-hidden animate-pulse">
          {/* Header Skeleton */}
          <div className="bg-gradient-to-r from-primary-50 to-primary-100/50 p-8 text-center border-b border-gray-100">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gray-200 rounded-2xl"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded-xl mb-2 mx-8"></div>
            <div className="h-4 bg-gray-200 rounded-lg mx-12"></div>
          </div>

          {/* Form Skeleton */}
          <div className="p-8 space-y-6">
            {/* Email Field */}
            <div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-16"></div>
              <div className="h-12 bg-gray-200 rounded-2xl"></div>
            </div>

            {/* Password Field */}
            <div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-20"></div>
              <div className="h-12 bg-gray-200 rounded-2xl"></div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>

            {/* Login Button */}
            <div className="h-12 bg-gray-200 rounded-2xl"></div>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <div className="h-4 bg-white w-12"></div>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <div className="h-4 bg-gray-200 rounded mx-16"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
