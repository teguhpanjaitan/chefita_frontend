"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, Save, ArrowLeft, ChevronDown, Check } from "lucide-react"

interface Recipe {
  id: number
  name: string
  costPerPortion: number
  category: string
}

interface SellingMenu {
  id?: number
  name: string
  recipes: Recipe[]
  totalHPP: number
  sellingPrice: number
  margin: number
}

interface MenuFormProps {
  isOpen: boolean
  onClose: () => void
  menu?: SellingMenu | null
  onSave: (menu: SellingMenu) => void
}

// Mock available recipes
const mockRecipes: Recipe[] = [
  { id: 1, name: "Ayam Geprek", costPerPortion: 6000, category: "Makanan Utama" },
  { id: 2, name: "Nasi Goreng", costPerPortion: 5000, category: "Makanan Utama" },
  { id: 3, name: "Roti Bakar", costPerPortion: 4000, category: "Snack" },
  { id: 4, name: "Es Teh Manis", costPerPortion: 1500, category: "Minuman" },
  { id: 5, name: "Mie Ayam", costPerPortion: 7000, category: "Makanan Utama" },
  { id: 6, name: "Gado-gado", costPerPortion: 5500, category: "Makanan Utama" },
  { id: 7, name: "Soto Ayam", costPerPortion: 6500, category: "Makanan Utama" },
  { id: 8, name: "Es Jeruk", costPerPortion: 2000, category: "Minuman" },
]

export default function MenuForm({ isOpen, onClose, menu, onSave }: MenuFormProps) {
  const [formData, setFormData] = useState<SellingMenu>({
    name: "",
    recipes: [],
    totalHPP: 0,
    sellingPrice: 0,
    margin: 0,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showRecipeDropdown, setShowRecipeDropdown] = useState(false)

  const isEditMode = !!menu

  useEffect(() => {
    if (menu) {
      setFormData(menu)
    } else {
      setFormData({
        name: "",
        recipes: [],
        totalHPP: 0,
        sellingPrice: 0,
        margin: 0,
      })
    }
    setErrors({})
  }, [menu, isOpen])

  // Calculate totals when recipes or selling price changes
  useEffect(() => {
    const totalHPP = formData.recipes.reduce((sum, recipe) => sum + recipe.costPerPortion, 0)
    const margin = formData.sellingPrice > 0 ? ((formData.sellingPrice - totalHPP) / formData.sellingPrice) * 100 : 0

    setFormData((prev) => ({
      ...prev,
      totalHPP,
      margin,
    }))
  }, [formData.recipes, formData.sellingPrice])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getMarginColor = (margin: number) => {
    if (margin >= 30) return "text-success-600 bg-success-50 border-success-200"
    if (margin >= 15) return "text-warning-600 bg-warning-50 border-warning-200"
    return "text-danger-600 bg-danger-50 border-danger-200"
  }

  const getMarginStatus = (margin: number) => {
    if (margin >= 30) return "Margin Bagus"
    if (margin >= 15) return "Margin Sedang"
    return "Margin Rendah"
  }

  const handleRecipeToggle = (recipe: Recipe) => {
    setFormData((prev) => {
      const isSelected = prev.recipes.some((r) => r.id === recipe.id)
      if (isSelected) {
        return {
          ...prev,
          recipes: prev.recipes.filter((r) => r.id !== recipe.id),
        }
      } else {
        return {
          ...prev,
          recipes: [...prev.recipes, recipe],
        }
      }
    })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Nama menu harus diisi"
    }

    if (formData.recipes.length === 0) {
      newErrors.recipes = "Minimal harus memilih 1 resep"
    }

    if (formData.sellingPrice <= 0) {
      newErrors.sellingPrice = "Harga jual harus lebih dari 0"
    }

    if (formData.sellingPrice <= formData.totalHPP) {
      newErrors.sellingPrice = "Harga jual harus lebih tinggi dari total HPP"
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

  const handlePriceChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "")
    const price = numericValue ? Number.parseInt(numericValue) : 0
    setFormData((prev) => ({ ...prev, sellingPrice: price }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-primary-50 to-primary-100/50 p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
              <span>{isEditMode ? "✏️ Edit Menu Jual" : "➕ Tambah Menu Jual"}</span>
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-white/80 rounded-xl transition-colors duration-200">
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Menu Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Menu <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 ${errors.name ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                placeholder="Masukkan nama menu jual..."
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Select Recipes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pilih Resep <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowRecipeDropdown(!showRecipeDropdown)}
                  className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 flex items-center justify-between ${errors.recipes ? "border-red-300 bg-red-50" : "border-gray-200"
                    }`}
                >
                  <span className={formData.recipes.length > 0 ? "text-gray-800" : "text-gray-400"}>
                    {formData.recipes.length > 0
                      ? `${formData.recipes.length} resep dipilih`
                      : "Pilih resep untuk menu ini"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {showRecipeDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-20 max-h-64 overflow-y-auto">
                    {mockRecipes.map((recipe) => {
                      const isSelected = formData.recipes.some((r) => r.id === recipe.id)
                      return (
                        <button
                          key={recipe.id}
                          type="button"
                          onClick={() => handleRecipeToggle(recipe)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 first:rounded-t-2xl last:rounded-b-2xl transition-colors duration-200 flex items-center justify-between"
                        >
                          <div>
                            <div className="font-medium text-gray-800">{recipe.name}</div>
                            <div className="text-sm text-gray-500">
                              {recipe.category} • HPP: {formatCurrency(recipe.costPerPortion)}
                            </div>
                          </div>
                          {isSelected && <Check className="w-5 h-5 text-primary-600" />}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
              {errors.recipes && <p className="text-red-500 text-sm mt-1">{errors.recipes}</p>}

              {/* Selected Recipes Display */}
              {formData.recipes.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-sm font-medium text-gray-700">Resep yang dipilih:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.recipes.map((recipe) => (
                      <div
                        key={recipe.id}
                        className="inline-flex items-center px-3 py-1 rounded-xl text-sm font-medium bg-primary-100 text-primary-700 border border-primary-200"
                      >
                        <span>{recipe.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRecipeToggle(recipe)}
                          className="ml-2 hover:bg-primary-200 rounded-full p-0.5 transition-colors duration-200"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Selling Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Harga Jual <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">Rp</span>
                <input
                  type="text"
                  value={formData.sellingPrice > 0 ? formData.sellingPrice.toLocaleString("id-ID") : ""}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 ${errors.sellingPrice ? "border-red-300 bg-red-50" : "border-gray-200"
                    }`}
                  placeholder="0"
                />
              </div>
              {errors.sellingPrice && <p className="text-red-500 text-sm mt-1">{errors.sellingPrice}</p>}
              {formData.sellingPrice > 0 && (
                <p className="text-sm text-gray-500 mt-1">Preview: {formatCurrency(formData.sellingPrice)}</p>
              )}
            </div>

            {/* Live Calculation Summary */}
            {formData.recipes.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-3xl p-6 border border-blue-200/50">
                <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Perhitungan Otomatis</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <p className="text-sm text-gray-600 mb-1">Total HPP</p>
                    <p className="text-2xl font-bold text-gray-800">{formatCurrency(formData.totalHPP)}</p>
                    <p className="text-xs text-gray-500 mt-1">dari {formData.recipes.length} resep</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <p className="text-sm text-gray-600 mb-1">Harga Jual</p>
                    <p className="text-2xl font-bold text-primary-600">
                      {formData.sellingPrice > 0 ? formatCurrency(formData.sellingPrice) : "Rp 0"}
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <p className="text-sm text-gray-600 mb-1">Margin</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-2xl font-bold text-gray-800">{formData.margin.toFixed(1)}%</p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold border ${getMarginColor(formData.margin)}`}
                      >
                        {getMarginStatus(formData.margin)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Margin Warning */}
                {formData.sellingPrice > 0 && formData.margin < 15 && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-700">
                      ⚠️ Margin terlalu rendah! Pertimbangkan untuk menaikkan harga jual atau mengurangi HPP.
                    </p>
                  </div>
                )}

                {/* Profit Calculation */}
                {formData.sellingPrice > formData.totalHPP && (
                  <div className="mt-4 p-3 bg-success-50 border border-success-200 rounded-xl">
                    <p className="text-sm text-success-700">
                      💰 Keuntungan per menu:{" "}
                      <strong>{formatCurrency(formData.sellingPrice - formData.totalHPP)}</strong>
                    </p>
                  </div>
                )}
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
              <span>Simpan Menu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
