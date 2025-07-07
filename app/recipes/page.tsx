"use client"

import { useState } from "react"
import { Search, Plus, Edit, FileText, ChevronDown, ChevronLeft, ChevronRight, ReceiptText} from "lucide-react"
import RecipeForm from "../../components/recipe-form"
import RecipeDetailModal from "../../components/receipe-detail-modal"
import Sidebar from "../../components/sidebar"
import { Header } from "@/components/common/Header"

interface RecipeIngredient {
  ingredientId: number
  ingredientName: string
  quantity: number
  unit: string
  cost: number
}

interface Recipe {
  id: number
  name: string
  ingredientCount: number // Rename this to avoid confusion
  totalCost: number
  costPerPortion: number
  margin: number
  category: string
  portions: number
  ingredients: RecipeIngredient[] // This is the detailed array
  createdDate?: string
  lastUpdated?: string
}

const mockRecipes: Recipe[] = [
  {
    id: 1,
    name: "Ayam Geprek",
    ingredientCount: 7, // Changed from 'ingredients'
    totalCost: 18000,
    costPerPortion: 6000,
    margin: 45,
    category: "Makanan Utama",
    portions: 3,
    createdDate: "2024-06-15",
    lastUpdated: "2024-06-28",
    ingredients: [
      // Changed from 'ingredientsList'
      { ingredientId: 1, ingredientName: "Ayam Fillet", quantity: 300, unit: "Gram", cost: 13500 },
      { ingredientId: 2, ingredientName: "Tepung Terigu", quantity: 100, unit: "Gram", cost: 1200 },
      { ingredientId: 3, ingredientName: "Telur Ayam", quantity: 1, unit: "Butir", cost: 2000 },
      { ingredientId: 4, ingredientName: "Cabai Merah", quantity: 50, unit: "Gram", cost: 1250 },
      { ingredientId: 5, ingredientName: "Bawang Putih", quantity: 20, unit: "Gram", cost: 700 },
      { ingredientId: 6, ingredientName: "Minyak Goreng", quantity: 0.05, unit: "Liter", cost: 900 },
      { ingredientId: 7, ingredientName: "Garam", quantity: 5, unit: "Gram", cost: 50 },
    ],
  },
  {
    id: 2,
    name: "Nasi Goreng",
    ingredientCount: 6,
    totalCost: 15000,
    costPerPortion: 5000,
    margin: 60,
    category: "Makanan Utama",
    portions: 3,
    createdDate: "2024-06-10",
    lastUpdated: "2024-06-25",
    ingredients: [
      { ingredientId: 1, ingredientName: "Beras", quantity: 200, unit: "Gram", cost: 3000 },
      { ingredientId: 2, ingredientName: "Telur Ayam", quantity: 2, unit: "Butir", cost: 4000 },
      { ingredientId: 3, ingredientName: "Bawang Merah", quantity: 30, unit: "Gram", cost: 900 },
      { ingredientId: 4, ingredientName: "Bawang Putih", quantity: 15, unit: "Gram", cost: 525 },
      { ingredientId: 5, ingredientName: "Kecap Manis", quantity: 30, unit: "ml", cost: 1500 },
      { ingredientId: 6, ingredientName: "Minyak Goreng", quantity: 0.03, unit: "Liter", cost: 540 },
    ],
  },
  {
    id: 3,
    name: "Roti Bakar",
    ingredientCount: 4,
    totalCost: 8000,
    costPerPortion: 4000,
    margin: 25,
    category: "Snack",
    portions: 2,
    createdDate: "2024-06-20",
    lastUpdated: "2024-06-30",
    ingredients: [
      { ingredientId: 1, ingredientName: "Roti Tawar", quantity: 4, unit: "Lembar", cost: 4000 },
      { ingredientId: 2, ingredientName: "Mentega", quantity: 20, unit: "Gram", cost: 2000 },
      { ingredientId: 3, ingredientName: "Gula Pasir", quantity: 10, unit: "Gram", cost: 135 },
      { ingredientId: 4, ingredientName: "Susu Kental Manis", quantity: 30, unit: "ml", cost: 1500 },
    ],
  },
  {
    id: 4,
    name: "Es Teh Manis",
    ingredientCount: 3,
    totalCost: 3000,
    costPerPortion: 1500,
    margin: 80,
    category: "Minuman",
    portions: 2,
    createdDate: "2024-06-05",
    lastUpdated: "2024-06-20",
    ingredients: [
      { ingredientId: 1, ingredientName: "Teh Celup", quantity: 2, unit: "Sachet", cost: 1000 },
      { ingredientId: 2, ingredientName: "Gula Pasir", quantity: 40, unit: "Gram", cost: 540 },
      { ingredientId: 3, ingredientName: "Es Batu", quantity: 100, unit: "Gram", cost: 500 },
    ],
  },
  {
    id: 5,
    name: "Mie Ayam",
    ingredientCount: 8,
    totalCost: 20000,
    costPerPortion: 7000,
    margin: 35,
    category: "Makanan Utama",
    portions: 3,
    createdDate: "2024-06-12",
    lastUpdated: "2024-06-27",
    ingredients: [
      { ingredientId: 1, ingredientName: "Mie Basah", quantity: 300, unit: "Gram", cost: 4500 },
      { ingredientId: 2, ingredientName: "Ayam Fillet", quantity: 200, unit: "Gram", cost: 9000 },
      { ingredientId: 3, ingredientName: "Sawi Hijau", quantity: 100, unit: "Gram", cost: 1500 },
      { ingredientId: 4, ingredientName: "Bawang Merah", quantity: 25, unit: "Gram", cost: 750 },
      { ingredientId: 5, ingredientName: "Bawang Putih", quantity: 15, unit: "Gram", cost: 525 },
      { ingredientId: 6, ingredientName: "Kecap Asin", quantity: 20, unit: "ml", cost: 800 },
      { ingredientId: 7, ingredientName: "Minyak Goreng", quantity: 0.04, unit: "Liter", cost: 720 },
      { ingredientId: 8, ingredientName: "Kaldu Ayam", quantity: 5, unit: "Gram", cost: 250 },
    ],
  },
]

const categories = ["Semua Kategori", "Makanan Utama", "Snack", "Minuman", "Dessert"]

function RecipeListContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Semua Kategori")
  const [currentPage, setCurrentPage] = useState(1)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [showRecipeForm, setShowRecipeForm] = useState(false)
  const [showRecipeDetail, setShowRecipeDetail] = useState(false)
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
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
      portions: recipe.portions,
      ingredients: recipe.ingredients || [],
    }
    setEditingRecipe(formRecipe as any)
    setShowRecipeForm(true)
  }

  const handleViewDetail = (recipe: Recipe) => {
    setSelectedRecipe(recipe)
    setShowRecipeDetail(true)
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
              portions: recipeData.portions,
              lastUpdated: new Date().toISOString().split("T")[0],
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
        portions: recipeData.portions,
        ingredientCount: recipeData.ingredients.length, // Changed from 'ingredients'
        totalCost: recipeData.ingredients.reduce((sum: number, ing: any) => sum + ing.cost, 0),
        costPerPortion: 0, // Calculate based on portions
        margin: 0, // Would be calculated
        ingredients: recipeData.ingredients, // Changed from 'ingredientsList'
        createdDate: new Date().toISOString().split("T")[0],
        lastUpdated: new Date().toISOString().split("T")[0],
      }
      setRecipes((prev) => [...prev, newRecipe])
    }
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-50 overflow-y-auto">
      <Header
        icon={<ReceiptText className="w-9 h-9 text-primary" />}
        title="Daftar Resep"
        subTitle="Kelola semua resep dan pantau HPP untuk optimasi margin keuntungan"
        rightElement={<div className="text-right">
          <p className="text-sm text-gray-500">Total Resep</p>
          <p className="text-xl lg:text-2xl font-bold text-gray-800">{recipes.length}</p>
        </div>}
      />

      <div className="p-4 lg:p-8 space-y-6 lg:space-y-8">
        {/* Top Bar Filters */}
        <div className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm border border-gray-100/50">
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
              className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-4 lg:px-6 py-3 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 transform hover:scale-105"
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
                    className={`border-t border-gray-100 hover:bg-gray-50/50 transition-colors duration-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                      }`}
                  >
                    <td className="py-4 px-6">
                      <div className="font-semibold text-gray-800">{recipe.name}</div>
                      <div className="text-sm text-gray-500">{recipe.category}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-700">{recipe.ingredientCount} bahan</span>
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
                          title="Edit Resep"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleViewDetail(recipe)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors duration-200"
                          title="Lihat Detail"
                        >
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
            <div
              key={recipe.id}
              className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm border border-gray-100/50"
            >
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
                  <p className="font-semibold text-gray-800">{recipe.ingredientCount} bahan</p>
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
                <button
                  onClick={() => handleViewDetail(recipe)}
                  className="flex-1 bg-blue-50 text-blue-600 py-2 px-4 rounded-xl font-semibold hover:bg-blue-100 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
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
      </div>

      {/* Recipe Form Modal */}
      <RecipeForm
        isOpen={showRecipeForm}
        onClose={() => setShowRecipeForm(false)}
        recipe={editingRecipe}
        onSave={handleSaveRecipe}
      />

      {/* Recipe Detail Modal */}
      <RecipeDetailModal
        isOpen={showRecipeDetail}
        onClose={() => setShowRecipeDetail(false)}
        recipe={selectedRecipe}
        onEdit={handleEditRecipe}
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
