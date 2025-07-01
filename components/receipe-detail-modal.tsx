"use client"

import { X, ChefHat, Package, Calculator, TrendingUp, Edit } from "lucide-react"

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
  category: string
  portions: number
  ingredients: RecipeIngredient[]
  totalCost: number
  costPerPortion: number
  margin: number
  createdDate?: string
  lastUpdated?: string
}

interface RecipeDetailModalProps {
  isOpen: boolean
  onClose: () => void
  recipe: Recipe | null
  onEdit?: (recipe: Recipe) => void
}

export default function RecipeDetailModal({ isOpen, onClose, recipe, onEdit }: RecipeDetailModalProps) {
  if (!isOpen || !recipe) return null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-"
    const date = new Date(dateString)
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const getMarginColor = (margin: number) => {
    if (margin >= 50) return "text-success-600 bg-success-50 border-success-200"
    if (margin >= 30) return "text-warning-600 bg-warning-50 border-warning-200"
    return "text-danger-600 bg-danger-50 border-danger-200"
  }

  const getMarginStatus = (margin: number) => {
    if (margin >= 50) return "Sangat Menguntungkan"
    if (margin >= 30) return "Cukup Menguntungkan"
    return "Perlu Optimasi"
  }

  // Calculate suggested selling price based on different margin targets
  const calculateSellingPrice = (targetMargin: number) => {
    return recipe.costPerPortion / (1 - targetMargin / 100)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-primary-50 to-primary-100/50 p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/25">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{recipe.name}</h2>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-sm text-gray-600">{recipe.category}</span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-600">{recipe.portions} porsi</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getMarginColor(recipe.margin)}`}
                  >
                    {recipe.margin}% margin
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={onClose} className="p-2 hover:bg-white/80 rounded-xl transition-colors duration-200">
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-8">
            {/* Cost Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 border border-blue-200/50">
                <div className="flex items-center space-x-3 mb-3">
                  <Calculator className="w-6 h-6 text-blue-600" />
                  <h3 className="font-semibold text-gray-800">Total HPP</h3>
                </div>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(recipe.totalCost)}</p>
                <p className="text-sm text-gray-600 mt-1">Untuk {recipe.portions} porsi</p>
              </div>

              <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-2xl p-6 border border-primary-200/50">
                <div className="flex items-center space-x-3 mb-3">
                  <Package className="w-6 h-6 text-primary-600" />
                  <h3 className="font-semibold text-gray-800">HPP per Porsi</h3>
                </div>
                <p className="text-2xl font-bold text-primary-600">{formatCurrency(recipe.costPerPortion)}</p>
                <p className="text-sm text-gray-600 mt-1">Biaya produksi</p>
              </div>

              <div
                className={`bg-gradient-to-br rounded-2xl p-6 border ${
                  recipe.margin >= 50
                    ? "from-success-50 to-success-100/50 border-success-200/50"
                    : recipe.margin >= 30
                      ? "from-warning-50 to-warning-100/50 border-warning-200/50"
                      : "from-danger-50 to-danger-100/50 border-danger-200/50"
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <TrendingUp
                    className={`w-6 h-6 ${
                      recipe.margin >= 50
                        ? "text-success-600"
                        : recipe.margin >= 30
                          ? "text-warning-600"
                          : "text-danger-600"
                    }`}
                  />
                  <h3 className="font-semibold text-gray-800">Margin Saat Ini</h3>
                </div>
                <p
                  className={`text-2xl font-bold ${
                    recipe.margin >= 50
                      ? "text-success-600"
                      : recipe.margin >= 30
                        ? "text-warning-600"
                        : "text-danger-600"
                  }`}
                >
                  {recipe.margin}%
                </p>
                <p className="text-sm text-gray-600 mt-1">{getMarginStatus(recipe.margin)}</p>
              </div>
            </div>

            {/* Ingredients List */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 p-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                  <Package className="w-5 h-5" />
                  <span>Daftar Bahan ({(recipe.ingredients || []).length} item)</span>
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Nama Bahan</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Jumlah</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Satuan</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Biaya</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">% dari Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(recipe.ingredients || []).map((ingredient, index) => {
                      const percentage = (ingredient.cost / recipe.totalCost) * 100
                      return (
                        <tr
                          key={ingredient.ingredientId}
                          className={`border-t border-gray-100 hover:bg-gray-50/50 transition-colors duration-200 ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                          }`}
                        >
                          <td className="py-3 px-4">
                            <span className="font-medium text-gray-800">{ingredient.ingredientName}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-gray-700">{ingredient.quantity}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-gray-700">{ingredient.unit}</span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="font-semibold text-gray-800">{formatCurrency(ingredient.cost)}</span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <span className="text-sm text-gray-600">{percentage.toFixed(1)}%</span>
                              <div className="w-12 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${Math.min(percentage, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot className="bg-gradient-to-r from-primary-50 to-primary-100/50 border-t-2 border-primary-200">
                    <tr>
                      <td colSpan={3} className="py-4 px-4 font-bold text-gray-800">
                        Total HPP
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-primary-600 text-lg">
                        {formatCurrency(recipe.totalCost)}
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-gray-800">100%</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Pricing Suggestions */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-2xl p-6 border border-blue-200/50">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>💡 Saran Harga Jual</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 border border-blue-200/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Margin 30%</span>
                    <span className="text-xs bg-warning-100 text-warning-700 px-2 py-1 rounded-full">Minimum</span>
                  </div>
                  <p className="text-xl font-bold text-gray-800">{formatCurrency(calculateSellingPrice(30))}</p>
                  <p className="text-xs text-gray-500 mt-1">per porsi</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-blue-200/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Margin 50%</span>
                    <span className="text-xs bg-success-100 text-success-700 px-2 py-1 rounded-full">Ideal</span>
                  </div>
                  <p className="text-xl font-bold text-gray-800">{formatCurrency(calculateSellingPrice(50))}</p>
                  <p className="text-xs text-gray-500 mt-1">per porsi</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-blue-200/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Margin 70%</span>
                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">Premium</span>
                  </div>
                  <p className="text-xl font-bold text-gray-800">{formatCurrency(calculateSellingPrice(70))}</p>
                  <p className="text-xs text-gray-500 mt-1">per porsi</p>
                </div>
              </div>
            </div>

            {/* Recipe Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Informasi Resep</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Jumlah Bahan:</span>
                    <span className="font-semibold text-gray-800">{(recipe.ingredients || []).length} item</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Porsi per Batch:</span>
                    <span className="font-semibold text-gray-800">{recipe.portions} porsi</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kategori:</span>
                    <span className="font-semibold text-gray-800">{recipe.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status Margin:</span>
                    <span
                      className={`font-semibold ${
                        recipe.margin >= 50
                          ? "text-success-600"
                          : recipe.margin >= 30
                            ? "text-warning-600"
                            : "text-danger-600"
                      }`}
                    >
                      {getMarginStatus(recipe.margin)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">📅 Riwayat</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dibuat:</span>
                    <span className="font-semibold text-gray-800">{formatDate(recipe.createdDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Terakhir Diupdate:</span>
                    <span className="font-semibold text-gray-800">{formatDate(recipe.lastUpdated)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID Resep:</span>
                    <span className="font-mono text-sm text-gray-600">#{recipe.id.toString().padStart(4, "0")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-6 bg-gray-50/50">
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-200"
            >
              Tutup
            </button>
            {onEdit && (
              <button
                onClick={() => onEdit(recipe)}
                className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-2xl font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-primary-500/25"
              >
                <Edit className="w-5 h-5" />
                <span>Edit Resep</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
