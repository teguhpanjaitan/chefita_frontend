"use client"

import { useState } from "react"
import { Search, Plus, Edit, FileText, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import Sidebar from "../../components/sidebar"
import RecipeForm from "../../components/recipe-form"

interface Recipe {
  id: number
  name: string
  ingredients: number
  totalCost: number
  costPerPortion: number
  margin: number
  category: string
}

const mockRecipes: Recipe[] = [
  {
    id: 1,
    name: "Ayam Geprek",
    ingredients: 7,
    totalCost: 18000,
    costPerPortion: 6000,
    margin: 45,
    category: "Makanan Utama",
  },
  {
    id: 2,
    name: "Nasi Goreng",
    ingredients: 6,
    totalCost: 15000,
    costPerPortion: 5000,
    margin: 60,
    category: "Makanan Utama",
  },
  {
    id: 3,
    name: "Roti Bakar",
    ingredients: 4,
    totalCost: 8000,
    costPerPortion: 4000,
    margin: 25,
    category: "Snack",
  },
  {
    id: 4,
    name: "Es Teh Manis",
    ingredients: 3,
    totalCost: 3000,
    costPerPortion: 1500,
    margin: 80,
    category: "Minuman",
  },
  {
    id: 5,
    name: "Mie Ayam",
    ingredients: 8,
    totalCost: 20000,
    costPerPortion: 7000,
    margin: 35,
    category: "Makanan Utama",
  },
]

const categories = ["Semua Kategori", "Makanan Utama", "Snack", "Minuman", "Dessert"]

function RecipeListContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Semua Kategori")
  const [currentPage, setCurrentPage] = useState(1)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [showRecipeForm, setShowRecipeForm] = useState(false)
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null)
  const [recipes, setRecipes] = useState(mockRecipes)
  const itemsPerPage = 10

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "Semua Kategori" || recipe.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalPages = Math.ceil(filteredRecipes.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedRecipes = filteredRecipes.slice(startIndex, startIndex + itemsPerPage)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getMarginColor = (margin: number) => {
    if (margin >= 50) return "text-success-600 bg-success-50"
    if (margin >= 30) return "text-warning-600 bg-warning-50"
    return "text-danger-600 bg-danger-50"
  }

  const handleAddRecipe = () => {
    setEditingRecipe(null)
    setShowRecipeForm(true)
  }

  const handleEditRecipe = (recipe: Recipe) => {
    // Convert Recipe to form format
    const formRecipe = {
      id: recipe.id,
      name: recipe.name,
      category: recipe.category,
      portions: 1, // Default, would come from actual data
      ingredients: [], // Would be populated from actual recipe data
    }
    setEditingRecipe(formRecipe as any)
    setShowRecipeForm(true)
  }

  const handleSaveRecipe = (recipeData: any) => {
    if (recipeData.id) {
      // Update existing recipe
      setRecipes((prev) =>
        prev.map((recipe) =>
          recipe.id === recipeData.id
            ? {
                ...recipe,
                name: recipeData.name,
                category: recipeData.category,
                // Update other fields based on ingredients calculation
              }
            : recipe,
        ),
      )
    } else {
      // Add new recipe
      const newRecipe: Recipe = {
        id: Math.max(...recipes.map((r) => r.id)) + 1,
        name: recipeData.name,
        category: recipeData.category,
        ingredients: recipeData.ingredients.length,
        totalCost: recipeData.ingredients.reduce((sum: number, ing: any) => sum + ing.cost, 0),
        costPerPortion: 0, // Calculate based on portions
        margin: 0, // Would be calculated
      }
      setRecipes((prev) => [...prev, newRecipe])
    }
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-50 overflow-y-auto">
      {/* Modern Header with gradient */}
      <div className="relative bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100/50">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-50/30 to-transparent"></div>
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                📋 Daftar Resep
              </h1>
              <p className="text-gray-600 text-lg">
                Kelola semua resep dan pantau HPP untuk optimasi margin keuntungan
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Resep</p>
                <p className="text-2xl font-bold text-gray-800">{recipes.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                  placeholder="Cari nama resep..."
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

            {/* Add Recipe Button */}
            <button
              onClick={handleAddRecipe}
              className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Tambah Resep</span>
            </button>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block bg-white rounded-3xl shadow-sm border border-gray-100/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Nama Resep</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Jumlah Bahan</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Total HPP</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">HPP/Porsi</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Estimasi Margin</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRecipes.map((recipe, index) => (
                  <tr
                    key={recipe.id}
                    className={`border-t border-gray-100 hover:bg-gray-50/50 transition-colors duration-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="font-semibold text-gray-800">{recipe.name}</div>
                      <div className="text-sm text-gray-500">{recipe.category}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-700">{recipe.ingredients} bahan</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-gray-800">{formatCurrency(recipe.totalCost)}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-gray-800">{formatCurrency(recipe.costPerPortion)}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getMarginColor(recipe.margin)}`}>
                        {recipe.margin}%
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditRecipe(recipe)}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-xl transition-colors duration-200"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors duration-200">
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4">
          {paginatedRecipes.map((recipe) => (
            <div key={recipe.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/50">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{recipe.name}</h3>
                  <p className="text-sm text-gray-500">{recipe.category}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getMarginColor(recipe.margin)}`}>
                  {recipe.margin}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Jumlah Bahan</p>
                  <p className="font-semibold text-gray-800">{recipe.ingredients} bahan</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total HPP</p>
                  <p className="font-semibold text-gray-800">{formatCurrency(recipe.totalCost)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">HPP/Porsi</p>
                  <p className="font-semibold text-gray-800">{formatCurrency(recipe.costPerPortion)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Estimasi Margin</p>
                  <p className="font-semibold text-gray-800">{recipe.margin}%</p>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleEditRecipe(recipe)}
                  className="flex-1 bg-primary-50 text-primary-600 py-2 px-4 rounded-xl font-semibold hover:bg-primary-100 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button className="flex-1 bg-blue-50 text-blue-600 py-2 px-4 rounded-xl font-semibold hover:bg-blue-100 transition-colors duration-200 flex items-center justify-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Detail</span>
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
                  className={`w-10 h-10 rounded-xl font-semibold transition-colors duration-200 ${
                    currentPage === page ? "bg-primary-500 text-white" : "border border-gray-200 hover:bg-gray-50"
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
      </div>

      {/* Recipe Form Modal */}
      <RecipeForm
        isOpen={showRecipeForm}
        onClose={() => setShowRecipeForm(false)}
        recipe={editingRecipe}
        onSave={handleSaveRecipe}
      />
    </div>
  )
}

export default function RecipeListPage() {
  return (
    <div className="flex h-screen bg-gray-50 font-poppins">
      <Sidebar />
      <RecipeListContent />
    </div>
  )
}
