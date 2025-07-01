"use client"

import { AlertTriangle, X, Trash2, Check } from "lucide-react"

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: "danger" | "warning" | "info"
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  type = "danger",
}: ConfirmDialogProps) {
  if (!isOpen) return null

  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          icon: Trash2,
          iconBg: "bg-gradient-to-br from-red-500 to-red-600",
          iconColor: "text-white",
          confirmBg: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
          confirmShadow: "shadow-red-500/25",
        }
      case "warning":
        return {
          icon: AlertTriangle,
          iconBg: "bg-gradient-to-br from-warning-500 to-warning-600",
          iconColor: "text-white",
          confirmBg: "bg-gradient-to-r from-warning-500 to-warning-600 hover:from-warning-600 hover:to-warning-700",
          confirmShadow: "shadow-warning-500/25",
        }
      case "info":
        return {
          icon: Check,
          iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
          iconColor: "text-white",
          confirmBg: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
          confirmShadow: "shadow-blue-500/25",
        }
      default:
        return {
          icon: AlertTriangle,
          iconBg: "bg-gradient-to-br from-red-500 to-red-600",
          iconColor: "text-white",
          confirmBg: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
          confirmShadow: "shadow-red-500/25",
        }
    }
  }

  const styles = getTypeStyles()
  const IconComponent = styles.icon

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-gray-50 to-gray-100/50 p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className={`w-12 h-12 ${styles.iconBg} rounded-2xl flex items-center justify-center shadow-lg ${styles.confirmShadow}`}
              >
                <IconComponent className={`w-6 h-6 ${styles.iconColor}`} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/80 rounded-xl transition-colors duration-200">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 leading-relaxed">{message}</p>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-100 p-6 bg-gray-50/50">
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-200"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-6 py-3 ${styles.confirmBg} text-white rounded-2xl font-semibold transition-all duration-200 shadow-lg ${styles.confirmShadow}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
