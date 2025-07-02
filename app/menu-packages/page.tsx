"use client"

import { useState } from "react"
import { Search, Plus, Edit, Trash2, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import Sidebar from "../../components/sidebar"
import MenuPackageForm from "../../components/menu-package-form"
import { useToast } from "@/hooks/use-toast"

interface MenuItem {
  id: number
  name: string
  sellingPrice: number
  totalHPP: number
}

interface MenuPackage {
  id: number
  name: string
  menuItems: MenuItem[]
  totalHPP: number
  sellingPrice: number
  margin: number
  createdDate?: string
  lastUpdated?: string
}

const mockMenuPackages: MenuPackage[] = [
  {
    id: 1,
    name: "Paket Hemat Keluarga",
    menuItems: [
      { id: 1, name: "Paket Ayam Geprek + Es Teh", sellingPrice: 15000, totalHPP: 7500 },
      { id: 2, name: "Nasi Goreng Special", sellingPrice: 12000, totalHPP: 5000 },
    ],
    totalHPP: 12500,
    sellingPrice: 22000,
    margin: 43.2,
    createdDate: "2024-06-15",
    lastUpdated: "2024-06-28",
  },
  {
    id: 2,
    name: "Paket Sarapan Pagi",
    menuItems: [
      { id: 3, name: "Paket Sarapan", sellingPrice: 8000, totalHPP: 5500 },
      { id: 4, name: "Mie Ayam Komplit", sellingPrice: 10000, totalHPP: 7000 },
    ],
    totalHPP: 12500,
    sellingPrice: 15000,
    margin: 16.7,
    createdDate: "2024-06-10",
    lastUpdated: "2024-06-25",
  },
  {
    id: 3,
    name: "Paket Makan Siang",
    menuItems: [
      { id: 1, name: "Paket Ayam Geprek + Es Teh", sellingPrice: 15000, totalHPP: 7500 },
      { id: 5, name: "Paket Hemat", sellingPrice: 11000, totalHPP: 9000 },
    ],
    totalHPP: 16500,
    sellingPrice: 23000,
    margin: 28.3,
    createdDate: "2024-06-20",
    lastUpdated: "2024-06-30",
  },
  {
    id: 4,
    name: "Paket Spesial Weekend",
    menuItems: [
      { id: 2, name: "Nasi Goreng Special", sellingPrice: 12000, totalHPP: 5000 },
      { id: 3, name: "Paket Sarapan", sellingPrice: 8000, totalHPP: 5500 },
      { id: 4, name: "Mie Ayam Komplit", sellingPrice: 10000, totalHPP: 7000 },
    ],
    totalHPP: 17500,
    sellingPrice: 25000,
    margin: 30.0,
    createdDate: "2024-06-12",
    lastUpdated: "2024-06-27",
  },
  {
    id: 5,
    name: "Paket Ekonomis",
    menuItems: [{ id: 5, name: "Paket Hemat", sellingPrice: 11000, totalHPP: 9000 }],
    totalHPP: 9000,
    sellingPrice: 10000,
    margin: 10.0,
    createdDate: "2024-06-18",
    lastUpdated: "2024-06-29",
  },
]

const filterOptions = ["Semua", "Margin Bagus (≥30%)", "Margin Rendah (<30%)"]

function MenuPackageListContent() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("Semua")
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [showMenuPackageForm, setShowMenuPackageForm] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingPackage, setEditingPackage] = useState<MenuPackage | null>(null)
  const [deletingPackage, setDeletingPackage] = useState<MenuPackage | null>(null)
  const [packages, setPackages] = useState(mockMenuPackages)
  const itemsPerPage = 10

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase())

    if (selectedFilter === "Margin Bagus (≥30%)") {
      return matchesSearch && pkg.margin >= 30
    } else if (selectedFilter === "Margin Rendah (<30%)") {
      return matchesSearch && pkg.margin < 30
    }

    return matchesSearch
  })

  const totalPages = Math.ceil(filteredPackages.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedPackages = filteredPackages.slice(startIndex, startIndex + itemsPerPage)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getMarginBadgeColor = (margin: number) => {
    if (margin >= 30) return "bg-success-100 text-success-700 border-success-200"
    if (margin >= 15) return "bg-warning-100 text-warning-700 border-warning-200"
    return "bg-danger-100 text-danger-700 border-danger-200"
  }

  const handleAddPackage = () => {
    setEditingPackage(null)
    setShowMenuPackageForm(true)
  }

  const handleEditPackage = (pkg: MenuPackage) => {
    setEditingPackage(pkg)
    setShowMenuPackageForm(true)
  }

  const handleDeletePackage = (pkg: MenuPackage) => {
    setDeletingPackage(pkg)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (deletingPackage) {
      setPackages((prev) => prev.filter((pkg) => pkg.id !== deletingPackage.id))
      toast({
        title: "Paket berhasil dihapus",
        description: `Paket "${deletingPackage.name}" telah dihapus dari daftar`,
        variant: "success",
      })
      setShowDeleteModal(false)
      setDeletingPackage(null)
    }
  }

  const handleSavePackage = (packageData: any) => {
    if (packageData.id) {
      // Update existing package
      setPackages((prev) =>
        prev.map((pkg) =>
          pkg.id === packageData.id
            ? {
              ...pkg,
              name: packageData.name,
              menuItems: packageData.menuItems,
              totalHPP: packageData.totalHPP,
              sellingPrice: packageData.sellingPrice,
              margin: packageData.margin,
              lastUpdated: new Date().toISOString().split("T")[0],
            }
            : pkg,
        ),
      )
      toast({
        title: "Paket berhasil diperbarui",
        description: `Paket "${packageData.name}" telah diperbarui`,
        variant: "success",
      })
    } else {
      // Add new package
      const newPackage: MenuPackage = {
        id: Math.max(...packages.map((p) => p.id)) + 1,
        name: packageData.name,
        menuItems: packageData.menuItems,
        totalHPP: packageData.totalHPP,
        sellingPrice: packageData.sellingPrice,
        margin: packageData.margin,
        createdDate: new Date().toISOString().split("T")[0],
        lastUpdated: new Date().toISOString().split("T")[0],
      }
      setPackages((prev) => [...prev, newPackage])
      toast({
        title: "Paket berhasil ditambahkan",
        description: `Paket "${packageData.name}" telah ditambahkan ke daftar`,
        variant: "success",
      })
    }
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-50 overflow-y-auto">
      {/* Modern Header with gradient */}
      <div className="relative bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100/50">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-50/30 to-transparent"></div>
        <div className="relative p-4 lg:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                📦 Daftar Menu Paket
              </h1>
              <p className="text-gray-600 text-base lg:text-lg">
                Kombinasi beberapa menu jual dalam satu paket bundling
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Paket</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-800">{packages.length}</p>
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
                  placeholder="Cari nama paket..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="flex items-center justify-between w-full sm:w-48 px-4 py-3 border border-gray-200 rounded-2xl bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
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

            {/* Add Package Button */}
            <button
              onClick={handleAddPackage}
              className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-4 lg:px-6 py-3 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Tambah Menu Paket</span>
            </button>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block bg-white rounded-3xl shadow-sm border border-gray-100/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Nama Paket</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Menu Termasuk</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Total HPP</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Harga Jual</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Estimasi Margin</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPackages.map((pkg, index) => (
                  <tr
                    key={pkg.id}
                    className={`border-t border-gray-100 hover:bg-gray-50/50 transition-colors duration-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                      }`}
                  >
                    <td className="py-4 px-6">
                      <div className="font-semibold text-gray-800">{pkg.name}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1">
                        {pkg.menuItems.map((menu) => (
                          <span
                            key={menu.id}
                            className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200"
                          >
                            {menu.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-gray-800">{formatCurrency(pkg.totalHPP)}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-gray-800">{formatCurrency(pkg.sellingPrice)}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold border ${getMarginBadgeColor(pkg.margin)}`}
                      >
                        {pkg.margin.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditPackage(pkg)}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-xl transition-colors duration-200"
                          title="Edit Paket"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePackage(pkg)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200"
                          title="Hapus Paket"
                        >
                          <Trash2 className="w-4 h-4" />
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
          {paginatedPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm border border-gray-100/50"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{pkg.name}</h3>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold border ${getMarginBadgeColor(pkg.margin)}`}
                >
                  {pkg.margin.toFixed(1)}%
                </span>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Menu Termasuk</p>
                <div className="flex flex-wrap gap-1">
                  {pkg.menuItems.map((menu) => (
                    <span
                      key={menu.id}
                      className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200"
                    >
                      {menu.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total HPP</p>
                  <p className="font-semibold text-gray-800">{formatCurrency(pkg.totalHPP)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Harga Jual</p>
                  <p className="font-semibold text-gray-800">{formatCurrency(pkg.sellingPrice)}</p>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleEditPackage(pkg)}
                  className="flex-1 bg-primary-50 text-primary-600 py-2 px-4 rounded-xl font-semibold hover:bg-primary-100 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeletePackage(pkg)}
                  className="flex-1 bg-red-50 text-red-600 py-2 px-4 rounded-xl font-semibold hover:bg-red-100 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Hapus</span>
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

      {/* Menu Package Form Modal */}
      <MenuPackageForm
        isOpen={showMenuPackageForm}
        onClose={() => setShowMenuPackageForm(false)}
        menuPackage={editingPackage}
        onSave={handleSavePackage}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingPackage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Hapus Paket</h3>
                  <p className="text-sm text-gray-600">Tindakan ini tidak dapat dibatalkan</p>
                </div>
              </div>

              <p className="text-gray-700 mb-6">
                Apakah Anda yakin ingin menghapus paket <strong>"{deletingPackage.name}"</strong>?
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors duration-200"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-3 bg-red-500 text-white rounded-2xl font-semibold hover:bg-red-600 transition-colors duration-200"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function MenuPackageListPage() {
  return (
    <div className="flex h-screen bg-gray-50 font-poppins">
      <Sidebar />
      <MenuPackageListContent />
    </div>
  )
}
