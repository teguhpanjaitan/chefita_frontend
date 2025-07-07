import { HeaderProps } from "@/types/components/header"

export function Header({
  icon,
  title,
  subTitle,
  rightElement,
}: HeaderProps) {
  return (
    <div className="relative bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100/50">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-50/30 to-transparent"></div>
      <div className="relative p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2 flex items-center space-x-3">
              {icon}
              <span>
                {title}
              </span>
            </h1>
            <p className="text-gray-600 text-lg">
              {subTitle}
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right">
              {rightElement}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}