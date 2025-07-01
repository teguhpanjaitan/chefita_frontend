"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Save, ArrowLeft, Tag } from "lucide-react"

interface Category {
  id?: number
  name: string
  description?: string
  isActive?: boolean
}

interface CategoryFormProps {
  isOpen: boolean
  onClose: () => void
  category?: Category | null
  onSave: (category: Omit<Category, "id" | "totalRecipes" | "createdDate">) => void
}

export default function CategoryForm({ isOpen, onClose, category, onSave }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isEditMode = !!category

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || "",
        isActive: category.isActive ?? true,
      })
    } else {
      setFormData({
        name: "",
        description: "",
        isActive: true,
      })
    }
    setErrors({})
  }, [category, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Nama kategori harus diisi"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Nama kategori minimal 2 karakter"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSave({
        name: formData.name.trim(),
        description: formData.description.trim(),
        isActive: formData.isActive,
      })
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-primary-50 to-primary-100/50 p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
              <Tag className="w-6 h-6 text-primary-600" />
              <span>{isEditMode ? "Edit Kategori" : "Tambah Kategori"}</span>
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-white/80 rounded-xl transition-colors duration-200">
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Nama Kategori */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Kategori <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 ${
                  errors.name ? "border-red-300 bg-red-50" : "border-gray-200"
                }`}
                placeholder="Masukkan nama kategori..."
                maxLength={50}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              <p className="text-xs text-gray-500 mt-1">{formData.name.length}/50 karakter</p>
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Deskripsi <span className="text-gray-400">(Opsional)</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 resize-none"
                placeholder="Tambahkan deskripsi kategori..."
                rows={3}
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.description.length}/200 karakter</p>
            </div>

            {/* Status Aktif */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-2xl p-4 border border-blue-200/50">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Kategori aktif
                </label>
              </div>
              <p className="text-xs text-gray-600 mt-2 ml-7">
                Kategori aktif akan muncul dalam pilihan saat membuat atau mengedit resep
              </p>
            </div>

            {/* Preview */}
            {formData.name && (
              <div className="bg-gradient-to-r from-success-50 to-success-100/50 rounded-2xl p-4 border border-success-200/50">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">📋 Preview Kategori</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-gray-600">Nama:</span>{" "}
                    <span className="font-semibold text-gray-800">{formData.name}</span>
                  </p>
                  {formData.description && (
                    <p>
                      <span className="text-gray-600">Deskripsi:</span>{" "}
                      <span className="text-gray-700">{formData.description}</span>
                    </p>
                  )}
                  <p>
                    <span className="text-gray-600">Status:</span>{" "}
                    <span className={`font-semibold ${formData.isActive ? "text-success-600" : "text-gray-600"}`}>
                      {formData.isActive ? "Aktif" : "Tidak Aktif"}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-100 p-6 bg-gray-50/50">
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Batal</span>
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-primary-500/25"
            >
              <Save className="w-5 h-5" />
              <span>{isEditMode ? "Simpan Perubahan" : "Tambah Kategori"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
