"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Plus, Trash2, Save, ArrowLeft, HelpCircle, ChevronDown } from "lucide-react"

interface Ingredient {
  id: number
  name: string
  unit: string
  price: number
}

interface RecipeIngredient {
  ingredientId: number
  ingredientName: string
  quantity: number
  unit: string
  cost: number
}

interface Recipe {
  id?: number
  name: string
  category: string
  portions: number
  ingredients: RecipeIngredient[]
}

interface RecipeFormProps {
  isOpen: boolean
  onClose: () => void
  recipe?: Recipe | null
  onSave: (recipe: Recipe) => void
}

const mockIngredients: Ingredient[] = [
  { id: 1, name: "Minyak Goreng", unit: "Liter", price: 18000 },
  { id: 2, name: "Telur Ayam", unit: "Butir", price: 2000 },
  { id: 3, name: "Daging Sapi", unit: "Gram", price: 120 },
  { id: 4, name: "Beras", unit: "Kg", price: 15000 },
  { id: 5, name: "Gula Pasir", unit: "Kg", price: 13500 },
  { id: 6, name: "Cabai Merah", unit: "Kg", price: 25000 },
  { id: 7, name: "Bawang Merah", unit: "Kg", price: 30000 },
  { id: 8, name: "Bawang Putih", unit: "Kg", price: 35000 },
  { id: 9, name: "Ayam Fillet", unit: "Kg", price: 45000 },
  { id: 10, name: "Tepung Terigu", unit: "Kg", price: 12000 },
]

const categories = ["Sarapan", "Makanan Berat", "Minuman", "Dessert", "Snack"]

export default function RecipeForm({ isOpen, onClose, recipe, onSave }: RecipeFormProps) {
  const [formData, setFormData] = useState<Recipe>({
    name: "",
    category: "",
    portions: 1,
    ingredients: [],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [ingredientDropdowns, setIngredientDropdowns] = useState<Record<number, boolean>>({})

  const isEditMode = !!recipe

  useEffect(() => {
    if (recipe) {
      setFormData(recipe)
    } else {
      setFormData({
        name: "",
        category: "",
        portions: 1,
        ingredients: [],
      })
    }
    setErrors({})
  }, [recipe, isOpen])

  const addIngredientRow = () => {
    const newIngredient: RecipeIngredient = {
      ingredientId: 0,
      ingredientName: "",
      quantity: 0,
      unit: "",
      cost: 0,
    }
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, newIngredient],
    }))
  }

  const removeIngredientRow = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }))
  }

  const updateIngredient = (index: number, field: keyof RecipeIngredient, value: any) => {
    setFormData((prev) => {
      const newIngredients = [...prev.ingredients]

      if (field === "ingredientId") {
        const selectedIngredient = mockIngredients.find((ing) => ing.id === value)
        if (selectedIngredient) {
          newIngredients[index] = {
            ...newIngredients[index],
            ingredientId: value,
            ingredientName: selectedIngredient.name,
            unit: selectedIngredient.unit,
            cost: newIngredients[index].quantity * selectedIngredient.price,
          }
        }
      } else if (field === "quantity") {
        const ingredient = mockIngredients.find((ing) => ing.id === newIngredients[index].ingredientId)
        newIngredients[index] = {
          ...newIngredients[index],
          [field]: value,
          cost: ingredient ? value * ingredient.price : 0,
        }
      } else {
        newIngredients[index] = {
          ...newIngredients[index],
          [field]: value,
        }
      }

      return {
        ...prev,
        ingredients: newIngredients,
      }
    })
  }

  const toggleIngredientDropdown = (index: number) => {
    setIngredientDropdowns((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const calculateTotals = () => {
    const totalCost = formData.ingredients.reduce((sum, ingredient) => sum + ingredient.cost, 0)
    const costPerPortion = formData.portions > 0 ? totalCost / formData.portions : 0
    return { totalCost, costPerPortion }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Nama resep harus diisi"
    }

    if (!formData.category) {
      newErrors.category = "Kategori harus dipilih"
    }

    if (formData.portions <= 0) {
      newErrors.portions = "Jumlah porsi harus lebih dari 0"
    }

    if (formData.ingredients.length === 0) {
      newErrors.ingredients = "Minimal harus ada 1 bahan"
    }

    formData.ingredients.forEach((ingredient, index) => {
      if (!ingredient.ingredientId) {
        newErrors[`ingredient_${index}`] = "Pilih bahan"
      }
      if (ingredient.quantity <= 0) {
        newErrors[`quantity_${index}`] = "Jumlah harus lebih dari 0"
      }
    })

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

  const { totalCost, costPerPortion } = calculateTotals()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-primary-50 to-primary-100/50 p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
              <span>{isEditMode ? "✏️ Edit Resep" : "➕ Tambah Resep"}</span>
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-white/80 rounded-xl transition-colors duration-200">
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Basic Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Nama Resep */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Resep <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 ${
                    errors.name ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                  placeholder="Masukkan nama resep..."
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Kategori Resep */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Kategori Resep <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 flex items-center justify-between ${
                      errors.category ? "border-red-300 bg-red-50" : "border-gray-200"
                    }`}
                  >
                    <span className={formData.category ? "text-gray-800" : "text-gray-400"}>
                      {formData.category || "Pilih Kategori"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {showCategoryDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-10">
                      {categories.map((category) => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, category }))
                            setShowCategoryDropdown(false)
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 first:rounded-t-2xl last:rounded-b-2xl transition-colors duration-200"
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>

              {/* Jumlah Porsi */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                  <span>
                    Jumlah Porsi <span className="text-red-500">*</span>
                  </span>
                  <div className="group relative">
                    <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      Digunakan untuk menghitung HPP per porsi
                    </div>
                  </div>
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.portions}
                  onChange={(e) => setFormData((prev) => ({ ...prev, portions: Number.parseInt(e.target.value) || 0 }))}
                  className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 ${
                    errors.portions ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                  placeholder="1"
                />
                {errors.portions && <p className="text-red-500 text-sm mt-1">{errors.portions}</p>}
              </div>
            </div>

            {/* Daftar Bahan */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Daftar Bahan & Takaran <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={addIngredientRow}
                  className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Bahan</span>
                </button>
              </div>

              {errors.ingredients && <p className="text-red-500 text-sm mb-4">{errors.ingredients}</p>}

              <div className="space-y-4">
                {formData.ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100"
                  >
                    {/* Pilih Bahan */}
                    <div className="md:col-span-5">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Pilih Bahan</label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => toggleIngredientDropdown(index)}
                          className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 flex items-center justify-between text-sm ${
                            errors[`ingredient_${index}`] ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
                          }`}
                        >
                          <span className={ingredient.ingredientName ? "text-gray-800" : "text-gray-400"}>
                            {ingredient.ingredientName || "Pilih Bahan"}
                          </span>
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </button>

                        {ingredientDropdowns[index] && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto">
                            {mockIngredients.map((ing) => (
                              <button
                                key={ing.id}
                                type="button"
                                onClick={() => {
                                  updateIngredient(index, "ingredientId", ing.id)
                                  toggleIngredientDropdown(index)
                                }}
                                className="w-full text-left px-3 py-2 hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl transition-colors duration-200 text-sm"
                              >
                                <div className="font-medium">{ing.name}</div>
                                <div className="text-xs text-gray-500">
                                  {formatCurrency(ing.price)}/{ing.unit}
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      {errors[`ingredient_${index}`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`ingredient_${index}`]}</p>
                      )}
                    </div>

                    {/* Jumlah */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Jumlah</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={ingredient.quantity}
                        onChange={(e) => updateIngredient(index, "quantity", Number.parseFloat(e.target.value) || 0)}
                        className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 text-sm ${
                          errors[`quantity_${index}`] ? "border-red-300 bg-red-50" : "border-gray-200"
                        }`}
                        placeholder="0"
                      />
                      {errors[`quantity_${index}`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`quantity_${index}`]}</p>
                      )}
                    </div>

                    {/* Satuan */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Satuan</label>
                      <input
                        type="text"
                        value={ingredient.unit}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-100 text-gray-600 text-sm"
                        placeholder="-"
                      />
                    </div>

                    {/* Biaya */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Biaya</label>
                      <input
                        type="text"
                        value={formatCurrency(ingredient.cost)}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-100 text-gray-600 text-sm font-semibold"
                      />
                    </div>

                    {/* Hapus */}
                    <div className="md:col-span-1 flex items-end">
                      <button
                        type="button"
                        onClick={() => removeIngredientRow(index)}
                        className="w-full md:w-auto p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors duration-200"
                        title="Hapus bahan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {formData.ingredients.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p className="mb-4">Belum ada bahan yang ditambahkan</p>
                    <button
                      type="button"
                      onClick={addIngredientRow}
                      className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-200 flex items-center space-x-2 mx-auto"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Tambah Bahan Pertama</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Perhitungan Otomatis */}
            {formData.ingredients.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-3xl p-6 border border-blue-200/50">
                <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Perhitungan Otomatis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <p className="text-sm text-gray-600 mb-1">Total HPP</p>
                    <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalCost)}</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <p className="text-sm text-gray-600 mb-1">HPP per Porsi</p>
                    <p className="text-2xl font-bold text-primary-600">{formatCurrency(costPerPortion)}</p>
                  </div>
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
              <span>Simpan Resep</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
