"use client"

import { useState } from "react"
import { Search, Save, ChevronDown, ChevronLeft, ChevronRight, Check, AlertTriangle } from "lucide-react"
import Sidebar from "../../components/sidebar"
import { useToast } from "@/hooks/use-toast"

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
  newPrice?: number
  isEdited?: boolean
  isUpdated?: boolean
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
    lastPrice: 120,
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
  {
    id: 7,
    name: "Bawang Merah",
    unit: "Kg",
    lastPrice: 30000,
    lastUpdate: "2024-06-25",
    usedInRecipes: 10,
    category: "Sayuran",
    isOutdated: false,
    updatedFromReceipt: false,
  },
  {
    id: 8,
    name: "Bawang Putih",
    unit: "Kg",
    lastPrice: 35000,
    lastUpdate: "2024-06-18",
    usedInRecipes: 14,
    category: "Sayuran",
    isOutdated: true,
    updatedFromReceipt: false,
  },
  {
    id: 9,
    name: "Tepung Terigu",
    unit: "Kg",
    lastPrice: 12000,
    lastUpdate: "2024-06-27",
    usedInRecipes: 6,
    category: "Karbohidrat",
    isOutdated: false,
    updatedFromReceipt: false,
  },
  {
    id: 10,
    name: "Kecap Manis",
    unit: "Botol",
    lastPrice: 15000,
    lastUpdate: "2024-06-15",
    usedInRecipes: 8,
    category: "Bumbu",
    isOutdated: true,
    updatedFromReceipt: false,
  },
]

const filterOptions = ["Semua", "Terakhir Diupdate (7 hari terakhir)", "Belum Pernah Diupdate"]

function PriceUpdateContent() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("Semua")
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [ingredients, setIngredients] = useState<Ingredient[]>(mockIngredients)
  const itemsPerPage = 10

  // Filter ingredients based on search term and selected filter
  const filteredIngredients = ingredients.filter((ingredient) => {
    const matchesSearch = ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())

    if (selectedFilter === "Terakhir Diupdate (7 hari terakhir)") {
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      const lastUpdateDate = new Date(ingredient.lastUpdate)
      return matchesSearch && lastUpdateDate >= sevenDaysAgo
    } else if (selectedFilter === "Belum Pernah Diupdate") {
      // This is a mock condition - in a real app, you'd check if the ingredient has never been updated
      return matchesSearch && ingredient.isOutdated
    }

    return matchesSearch
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

  const handlePriceChange = (id: number, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "")
    const newPrice = numericValue ? Number.parseInt(numericValue) : 0

    setIngredients((prev) =>
      prev.map((ingredient) => {
        if (ingredient.id === id) {
          return {
            ...ingredient,
            newPrice,
            isEdited: newPrice !== ingredient.lastPrice,
          }
        }
        return ingredient
      }),
    )
  }

  const handleUpdatePrice = (id: number) => {
    setIngredients((prev) =>
      prev.map((ingredient) => {
        if (ingredient.id === id && ingredient.newPrice !== undefined) {
          return {
            ...ingredient,
            lastPrice: ingredient.newPrice,
            lastUpdate: new Date().toISOString().split("T")[0],
            isOutdated: false,
            isEdited: false,
            isUpdated: true,
            newPrice: undefined,
          }
        }
        return ingredient
      }),
    )

    toast({
      title: "Harga berhasil diperbarui",
      description: "Harga bahan telah diperbarui dengan sukses",
      variant: "success",
    })

    // Reset the updated status after 3 seconds
    setTimeout(() => {
      setIngredients((prev) =>
        prev.map((ingredient) => {
          if (ingredient.id === id) {
            return {
              ...ingredient,
              isUpdated: false,
            }
          }
          return ingredient
        }),
      )
    }, 3000)
  }

  const handleSaveAllChanges = () => {
    const editedCount = ingredients.filter((i) => i.isEdited).length

    setIngredients((prev) =>
      prev.map((ingredient) => {
        if (ingredient.isEdited && ingredient.newPrice !== undefined) {
          return {
            ...ingredient,
            lastPrice: ingredient.newPrice,
            lastUpdate: new Date().toISOString().split("T")[0],
            isOutdated: false,
            isEdited: false,
            isUpdated: true,
            newPrice: undefined,
          }
        }
        return ingredient
      }),
    )

    toast({
      title: "Semua perubahan berhasil disimpan",
      description: `${editedCount} harga bahan telah diperbarui dengan sukses`,
      variant: "success",
    })

    // Reset the updated status after 3 seconds
    setTimeout(() => {
      setIngredients((prev) =>
        prev.map((ingredient) => ({
          ...ingredient,
          isUpdated: false,
        })),
      )
    }, 3000)
  }

  const editedCount = ingredients.filter((i) => i.isEdited).length

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-50 overflow-y-auto">
      {/* Header with gradient */}
      <div className="relative bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100/50">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-50/30 to-transparent"></div>
        <div className="relative p-4 lg:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                ✏️ Update Harga Manual
              </h1>
              <p className="text-gray-600 text-base lg:text-lg">
                Perbarui harga bahan baku secara manual jika tidak berasal dari nota belanja
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Bahan</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-800">{ingredients.length}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-warning-600">Perlu Update</p>
                <p className="text-xl lg:text-2xl font-bold text-warning-600">
                  {ingredients.filter((i) => i.isOutdated).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                  placeholder="Cari nama bahan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="flex items-center justify-between w-full sm:w-64 px-4 py-3 border border-gray-200 rounded-2xl bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                >
                  <span className="text-gray-700">{selectedFilter}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {showFilterDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-10">
                    {filterOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSelectedFilter(option)
                          setShowFilterDropdown(false)
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 first:rounded-t-2xl last:rounded-b-2xl transition-colors duration-200"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bulk Save Button - Only show when there are edited items */}
            {editedCount > 0 && (
              <button
                onClick={handleSaveAllChanges}
                className="bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 text-white px-4 lg:px-6 py-3 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-success-500/25 hover:shadow-xl hover:shadow-success-500/30 transform hover:scale-105"
              >
                <Save className="w-5 h-5" />
                <span>Simpan Semua Perubahan ({editedCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block bg-white rounded-3xl shadow-sm border border-gray-100/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Bahan</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Satuan</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Harga Saat Ini</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Terakhir Diupdate</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Harga Baru</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedIngredients.map((ingredient, index) => (
                  <tr
                    key={ingredient.id}
                    className={`border-t border-gray-100 transition-colors duration-200 ${ingredient.isUpdated
                      ? "bg-success-50"
                      : ingredient.isEdited
                        ? "bg-blue-50/50"
                        : index % 2 === 0
                          ? "bg-white"
                          : "bg-gray-50/30"
                      } hover:bg-gray-50/50`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div>
                          <div className="font-semibold text-gray-800">{ingredient.name}</div>
                          <div className="text-sm text-gray-500">{ingredient.category}</div>
                        </div>
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
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rp</span>
                        <input
                          type="text"
                          value={ingredient.newPrice !== undefined ? ingredient.newPrice.toLocaleString("id-ID") : ""}
                          onChange={(e) => handlePriceChange(ingredient.id, e.target.value)}
                          placeholder={ingredient.lastPrice.toLocaleString("id-ID")}
                          className={`w-full pl-10 pr-3 py-2 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${ingredient.isEdited
                            ? "border-primary-300 focus:ring-primary-500 bg-primary-50/30"
                            : "border-gray-200 focus:ring-gray-300"
                            }`}
                        />
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleUpdatePrice(ingredient.id)}
                        disabled={!ingredient.isEdited}
                        className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${ingredient.isEdited
                          ? "bg-success-500 text-white hover:bg-success-600"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          }`}
                      >
                        {ingredient.isUpdated ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Updated</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            <span>Update</span>
                          </>
                        )}
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
              className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50 ${ingredient.isUpdated ? "bg-success-50" : ingredient.isEdited ? "bg-blue-50/50" : ""
                }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{ingredient.name}</h3>
                  <p className="text-sm text-gray-500">{ingredient.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-800">{formatCurrency(ingredient.lastPrice)}</p>
                  <p className="text-sm text-gray-500">per {ingredient.unit}</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-500">Terakhir Diupdate</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-semibold text-gray-700">{formatDate(ingredient.lastUpdate)}</p>
                    {ingredient.isOutdated && (
                      <AlertTriangle className="w-4 h-4 text-warning-500" title="Harga sudah lama (>7 hari)" />
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-xs text-gray-500 mb-1">Harga Baru</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rp</span>
                    <input
                      type="text"
                      value={ingredient.newPrice !== undefined ? ingredient.newPrice.toLocaleString("id-ID") : ""}
                      onChange={(e) => handlePriceChange(ingredient.id, e.target.value)}
                      placeholder={ingredient.lastPrice.toLocaleString("id-ID")}
                      className={`w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${ingredient.isEdited
                        ? "border-primary-300 focus:ring-primary-500 bg-primary-50/30"
                        : "border-gray-200 focus:ring-gray-300"
                        }`}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleUpdatePrice(ingredient.id)}
                  disabled={!ingredient.isEdited}
                  className={`w-full py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${ingredient.isEdited
                    ? "bg-success-500 text-white hover:bg-success-600"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                >
                  {ingredient.isUpdated ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Updated</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Update Harga</span>
                    </>
                  )}
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
    </div>
  )
}

export default function PriceUpdatePage() {
  return (
    <div className="flex h-screen bg-gray-50 font-poppins">
      <Sidebar />
      <PriceUpdateContent />
    </div >
  )
}
