"use client"

import { useState } from "react"
import { Search, Plus, Edit, ChevronDown, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle, Box } from "lucide-react"
import Sidebar from "../../components/sidebar"
import IngredientForm from "../../components/ingredients-form"
import { Header } from "@/components/common/Header"

interface Ingredient {
  id: number
  name: string
  unit: string
  lastPrice: number
  lastUpdate: string
  usedInRecipes: number
  category: string
  isOutdated: boolean
  updatedFromReceipt: boolean
}

const mockIngredients: Ingredient[] = [
  {
    id: 1,
    name: "Minyak Goreng",
    unit: "Liter",
    lastPrice: 18000,
    lastUpdate: "2024-06-30",
    usedInRecipes: 11,
    category: "Minyak & Lemak",
    isOutdated: false,
    updatedFromReceipt: true,
  },
  {
    id: 2,
    name: "Telur Ayam",
    unit: "Butir",
    lastPrice: 2000,
    lastUpdate: "2024-06-29",
    usedInRecipes: 9,
    category: "Protein",
    isOutdated: false,
    updatedFromReceipt: false,
  },
  {
    id: 3,
    name: "Daging Sapi",
    unit: "Gram",
    lastPrice: 120000,
    lastUpdate: "2024-06-22",
    usedInRecipes: 5,
    category: "Protein",
    isOutdated: true,
    updatedFromReceipt: false,
  },
  {
    id: 4,
    name: "Beras",
    unit: "Kg",
    lastPrice: 15000,
    lastUpdate: "2024-06-28",
    usedInRecipes: 8,
    category: "Karbohidrat",
    isOutdated: false,
    updatedFromReceipt: true,
  },
  {
    id: 5,
    name: "Gula Pasir",
    unit: "Kg",
    lastPrice: 13500,
    lastUpdate: "2024-06-20",
    usedInRecipes: 12,
    category: "Pemanis",
    isOutdated: true,
    updatedFromReceipt: false,
  },
  {
    id: 6,
    name: "Cabai Merah",
    unit: "Kg",
    lastPrice: 25000,
    lastUpdate: "2024-06-30",
    usedInRecipes: 7,
    category: "Sayuran",
    isOutdated: false,
    updatedFromReceipt: true,
  },
]

const categories = ["Semua Kategori", "Protein", "Karbohidrat", "Sayuran", "Minyak & Lemak", "Pemanis", "Bumbu"]

function IngredientListContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Semua Kategori")
  const [currentPage, setCurrentPage] = useState(1)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const itemsPerPage = 10
  const [showIngredientForm, setShowIngredientForm] = useState(false)
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null)
  const [ingredients, setIngredients] = useState(mockIngredients)

  const filteredIngredients = mockIngredients.filter((ingredient) => {
    const matchesSearch = ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "Semua Kategori" || ingredient.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalPages = Math.ceil(filteredIngredients.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedIngredients = filteredIngredients.slice(startIndex, startIndex + itemsPerPage)

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
      month: "short",
      year: "numeric",
    })
  }

  const outdatedCount = mockIngredients.filter((ingredient) => ingredient.isOutdated).length

  const handleAddIngredient = () => {
    setEditingIngredient(null)
    setShowIngredientForm(true)
  }

  const handleEditIngredient = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient)
    setShowIngredientForm(true)
  }

  const handleSaveIngredient = (ingredientData: Ingredient) => {
    if (ingredientData.id) {
      // Update existing ingredient
      setIngredients((prev) =>
        prev.map((ingredient) =>
          ingredient.id === ingredientData.id ? { ...ingredient, ...ingredientData } : ingredient,
        ),
      )
    } else {
      // Add new ingredient
      const newIngredient: Ingredient = {
        ...ingredientData,
        id: Math.max(...ingredients.map((i) => i.id)) + 1,
        usedInRecipes: 0, // New ingredient starts with 0 recipes
      }
      setIngredients((prev) => [...prev, newIngredient])
    }
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-50 overflow-y-auto">
      {/* Modern Header with gradient */}
      <Header
        icon={<Box className="w-9 h-9 text-primary" />}
        title="Daftar Bahan"
        subTitle="Kelola harga bahan baku dan pantau update terbaru untuk akurasi HPP"
        rightElement={<div className="flex space-x-6"><div className="text-right">
                <p className="text-sm text-gray-500">Total Bahan</p>
                <p className="text-2xl font-bold text-gray-800">{mockIngredients.length}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-warning-600">Perlu Update</p>
                <p className="text-2xl font-bold text-warning-600">{outdatedCount}</p>
              </div></div>}
      />

      <div className="p-8 space-y-8">
        {/* Top Bar Filters */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/50">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari nama bahan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <button
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="flex items-center justify-between w-full sm:w-48 px-4 py-3 border border-gray-200 rounded-2xl bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                >
                  <span className="text-gray-700">{selectedCategory}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {showCategoryDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-10">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category)
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
            </div>

            <div className="flex gap-3">
              {/* Add Ingredient Button */}
              <button
                onClick={handleAddIngredient}
                className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-4 lg:px-6 py-3 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                <span>Tambah Bahan</span>
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block bg-white rounded-3xl shadow-sm border border-gray-100/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Nama Bahan</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Satuan</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Harga Terakhir</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Tanggal Update</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Digunakan di</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedIngredients.map((ingredient, index) => (
                  <tr
                    key={ingredient.id}
                    className={`border-t border-gray-100 hover:bg-gray-50/50 transition-colors duration-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                      } ${ingredient.updatedFromReceipt ? "bg-blue-50/30" : ""}`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div>
                          <div className="font-semibold text-gray-800">{ingredient.name}</div>
                          <div className="text-sm text-gray-500">{ingredient.category}</div>
                        </div>
                        {ingredient.updatedFromReceipt && (
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-blue-500" title="Diupdate dari nota" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-700">{ingredient.unit}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-gray-800">{formatCurrency(ingredient.lastPrice)}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-700">{formatDate(ingredient.lastUpdate)}</span>
                        {ingredient.isOutdated && (
                          <div className="flex items-center">
                            <AlertTriangle className="w-4 h-4 text-warning-500" title="Harga sudah lama (>7 hari)" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-700">{ingredient.usedInRecipes} resep</span>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleEditIngredient(ingredient)}
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-xl transition-colors duration-200"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4">
          {paginatedIngredients.map((ingredient) => (
            <div
              key={ingredient.id}
              className={`bg-white rounded-3xl p-6 shadow-sm border border-gray-100/50 ${ingredient.updatedFromReceipt ? "bg-blue-50/30 border-blue-200/50" : ""
                }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 flex items-center space-x-2">
                      <span>{ingredient.name}</span>
                      {ingredient.updatedFromReceipt && (
                        <CheckCircle className="w-4 h-4 text-blue-500" title="Diupdate dari nota" />
                      )}
                    </h3>
                    <p className="text-sm text-gray-500">{ingredient.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-800">{formatCurrency(ingredient.lastPrice)}</p>
                  <p className="text-sm text-gray-500">per {ingredient.unit}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Tanggal Update</p>
                  <div className="flex items-center space-x-2">
                    <p className="font-semibold text-gray-800">{formatDate(ingredient.lastUpdate)}</p>
                    {ingredient.isOutdated && (
                      <AlertTriangle className="w-4 h-4 text-warning-500" title="Harga sudah lama (>7 hari)" />
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Digunakan di</p>
                  <p className="font-semibold text-gray-800">{ingredient.usedInRecipes} resep</p>
                </div>
              </div>

              <div className="flex pt-4 border-t border-gray-100">
                <button className="w-full bg-primary-50 text-primary-600 py-2 px-4 rounded-xl font-semibold hover:bg-primary-100 transition-colors duration-200 flex items-center justify-center space-x-2">
                  <Edit className="w-4 h-4" />
                  <span>Edit Harga</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-xl font-semibold transition-colors duration-200 ${currentPage === page ? "bg-primary-500 text-white" : "border border-gray-200 hover:bg-gray-50"
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Ingredient Form Modal */}
        <IngredientForm
          isOpen={showIngredientForm}
          onClose={() => setShowIngredientForm(false)}
          ingredient={editingIngredient}
          onSave={handleSaveIngredient}
        />
      </div>
    </div>
  )
}

export default function IngredientListPage() {
  return (
    <div className="flex h-screen bg-gray-50 font-poppins">
      <Sidebar />
      <IngredientListContent />
    </div>
  )
}
