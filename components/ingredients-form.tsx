"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Save, ArrowLeft, HelpCircle, ChevronDown, Calendar } from "lucide-react"

interface Ingredient {
  id?: number
  name: string
  unit: string
  category: string
  lastPrice: number
  lastUpdate: string
  updatedFromReceipt?: boolean
}

interface IngredientFormProps {
  isOpen: boolean
  onClose: () => void
  ingredient?: Ingredient | null
  onSave: (ingredient: Ingredient) => void
}

const units = ["Gram", "Kilogram", "Butir", "Liter", "Bungkus", "Sendok Makan", "Sendok Teh", "Cup", "Potong", "Lembar"]

const categories = ["Minyak & Lemak", "Daging", "Sayuran", "Bumbu", "Karbohidrat", "Protein", "Pemanis", "Lainnya"]

export default function IngredientForm({ isOpen, onClose, ingredient, onSave }: IngredientFormProps) {
  const [formData, setFormData] = useState<Ingredient>({
    name: "",
    unit: "",
    category: "",
    lastPrice: 0,
    lastUpdate: new Date().toISOString().split("T")[0], // Today's date
    updatedFromReceipt: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showUnitDropdown, setShowUnitDropdown] = useState(false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)

  const isEditMode = !!ingredient

  useEffect(() => {
    if (ingredient) {
      setFormData({
        ...ingredient,
        lastUpdate: ingredient.lastUpdate || new Date().toISOString().split("T")[0],
      })
    } else {
      setFormData({
        name: "",
        unit: "",
        category: "",
        lastPrice: 0,
        lastUpdate: new Date().toISOString().split("T")[0],
        updatedFromReceipt: false,
      })
    }
    setErrors({})
  }, [ingredient, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Nama bahan harus diisi"
    }

    if (!formData.unit) {
      newErrors.unit = "Satuan harus dipilih"
    }

    if (formData.lastPrice <= 0) {
      newErrors.lastPrice = "Harga harus lebih dari 0"
    }

    if (!formData.lastUpdate) {
      newErrors.lastUpdate = "Tanggal update harus diisi"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSave(formData)
      onClose()
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-primary-50 to-primary-100/50 p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
              <span>{isEditMode ? "✏️ Edit Bahan" : "➕ Tambah Bahan"}</span>
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-white/80 rounded-xl transition-colors duration-200">
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Desktop Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Nama Bahan */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Bahan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 ${
                    errors.name ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                  placeholder="Masukkan nama bahan..."
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Satuan */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Satuan <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowUnitDropdown(!showUnitDropdown)}
                    className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 flex items-center justify-between ${
                      errors.unit ? "border-red-300 bg-red-50" : "border-gray-200"
                    }`}
                  >
                    <span className={formData.unit ? "text-gray-800" : "text-gray-400"}>
                      {formData.unit || "Pilih Satuan"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {showUnitDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-20 max-h-48 overflow-y-auto">
                      {units.map((unit) => (
                        <button
                          key={unit}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, unit }))
                            setShowUnitDropdown(false)
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 first:rounded-t-2xl last:rounded-b-2xl transition-colors duration-200"
                        >
                          {unit}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {errors.unit && <p className="text-red-500 text-sm mt-1">{errors.unit}</p>}
              </div>

              {/* Harga Terakhir */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                  <span>
                    Harga Terakhir <span className="text-red-500">*</span>
                  </span>
                  <div className="group relative">
                    <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      Harga satuan terakhir dari bahan ini
                    </div>
                  </div>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">Rp</span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={formData.lastPrice}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, lastPrice: Number.parseInt(e.target.value) || 0 }))
                    }
                    className={`w-full pl-12 pr-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 ${
                      errors.lastPrice ? "border-red-300 bg-red-50" : "border-gray-200"
                    }`}
                    placeholder="0"
                  />
                </div>
                {errors.lastPrice && <p className="text-red-500 text-sm mt-1">{errors.lastPrice}</p>}
                {formData.lastPrice > 0 && (
                  <p className="text-sm text-gray-500 mt-1">Preview: {formatCurrency(formData.lastPrice)}</p>
                )}
              </div>

              {/* Kategori Bahan */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori Bahan</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 flex items-center justify-between"
                  >
                    <span className={formData.category ? "text-gray-800" : "text-gray-400"}>
                      {formData.category || "Pilih Kategori (Opsional)"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {showCategoryDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-20 max-h-48 overflow-y-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, category: "" }))
                          setShowCategoryDropdown(false)
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 first:rounded-t-2xl transition-colors duration-200 text-gray-500"
                      >
                        Tidak ada kategori
                      </button>
                      {categories.map((category) => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, category }))
                            setShowCategoryDropdown(false)
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 last:rounded-b-2xl transition-colors duration-200"
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Tanggal Update Harga */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tanggal Update Harga <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.lastUpdate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, lastUpdate: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 ${
                      errors.lastUpdate ? "border-red-300 bg-red-50" : "border-gray-200"
                    }`}
                  />
                  <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                </div>
                {errors.lastUpdate && <p className="text-red-500 text-sm mt-1">{errors.lastUpdate}</p>}
                {formData.lastUpdate && (
                  <p className="text-sm text-gray-500 mt-1">Preview: {formatDate(formData.lastUpdate)}</p>
                )}
              </div>
            </div>

            {/* Preview Summary */}
            {formData.name && formData.unit && formData.lastPrice > 0 && (
              <div className="bg-gradient-to-r from-success-50 to-success-100/50 rounded-2xl p-4 border border-success-200/50">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">📋 Preview Bahan</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-gray-600">Nama:</span>{" "}
                    <span className="font-semibold text-gray-800">{formData.name}</span>
                  </p>
                  <p>
                    <span className="text-gray-600">Satuan:</span>{" "}
                    <span className="font-semibold text-gray-800">{formData.unit}</span>
                  </p>
                  {formData.category && (
                    <p>
                      <span className="text-gray-600">Kategori:</span>{" "}
                      <span className="font-semibold text-gray-800">{formData.category}</span>
                    </p>
                  )}
                  <p>
                    <span className="text-gray-600">Harga:</span>{" "}
                    <span className="font-semibold text-success-600">{formatCurrency(formData.lastPrice)}</span>
                    <span className="text-gray-500">/{formData.unit}</span>
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
              <span>Simpan Bahan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
