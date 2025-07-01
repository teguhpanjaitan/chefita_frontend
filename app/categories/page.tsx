"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Calendar, Package } from "lucide-react"
import Sidebar from "../../components/sidebar"
import CategoryForm from "../../components/category-form"
import ConfirmDialog from "../../components/confirm-dialog"

interface Category {
    id: number
    name: string
    totalRecipes: number
    createdDate: string
    description?: string
    isActive?: boolean
}

const mockCategories: Category[] = [
    {
        id: 1,
        name: "Makanan Berat",
        totalRecipes: 14,
        createdDate: "2024-06-28",
        description: "Menu utama untuk makan siang dan malam",
        isActive: true,
    },
    {
        id: 2,
        name: "Minuman",
        totalRecipes: 7,
        createdDate: "2024-06-25",
        description: "Berbagai jenis minuman segar dan hangat",
        isActive: true,
    },
    {
        id: 3,
        name: "Dessert",
        totalRecipes: 5,
        createdDate: "2024-06-20",
        description: "Makanan penutup dan camilan manis",
        isActive: false,
    },
    {
        id: 4,
        name: "Snack",
        totalRecipes: 8,
        createdDate: "2024-06-15",
        description: "Camilan ringan dan finger food",
        isActive: true,
    },
    {
        id: 5,
        name: "Sarapan",
        totalRecipes: 6,
        createdDate: "2024-06-10",
        description: "Menu khusus untuk sarapan pagi",
        isActive: true,
    },
    {
        id: 6,
        name: "Makanan Berat",
        totalRecipes: 14,
        createdDate: "2024-06-28",
        description: "Menu utama untuk makan siang dan malam",
        isActive: true,
    },
    {
        id: 7,
        name: "Minuman",
        totalRecipes: 7,
        createdDate: "2024-06-25",
        description: "Berbagai jenis minuman segar dan hangat",
        isActive: true,
    },
    {
        id: 8,
        name: "Dessert",
        totalRecipes: 5,
        createdDate: "2024-06-20",
        description: "Makanan penutup dan camilan manis",
        isActive: false,
    },
    {
        id: 9,
        name: "Snack",
        totalRecipes: 8,
        createdDate: "2024-06-15",
        description: "Camilan ringan dan finger food",
        isActive: true,
    },
    {
        id: 10,
        name: "Sarapan",
        totalRecipes: 6,
        createdDate: "2024-06-10",
        description: "Menu khusus untuk sarapan pagi",
        isActive: true,
    },
    {
        id: 11,
        name: "Makanan Berat",
        totalRecipes: 14,
        createdDate: "2024-06-28",
        description: "Menu utama untuk makan siang dan malam",
        isActive: true,
    },
    {
        id: 12,
        name: "Minuman",
        totalRecipes: 7,
        createdDate: "2024-06-25",
        description: "Berbagai jenis minuman segar dan hangat",
        isActive: true,
    },
    {
        id: 13,
        name: "Dessert",
        totalRecipes: 5,
        createdDate: "2024-06-20",
        description: "Makanan penutup dan camilan manis",
        isActive: false,
    },
    {
        id: 14,
        name: "Snack",
        totalRecipes: 8,
        createdDate: "2024-06-15",
        description: "Camilan ringan dan finger food",
        isActive: true,
    },
    {
        id: 15,
        name: "Sarapan",
        totalRecipes: 6,
        createdDate: "2024-06-10",
        description: "Menu khusus untuk sarapan pagi",
        isActive: true,
    },
]

function CategoryListContent() {
    const [categories, setCategories] = useState(mockCategories)
    const [showCategoryForm, setShowCategoryForm] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        })
    }

    const handleAddCategory = () => {
        setEditingCategory(null)
        setShowCategoryForm(true)
    }

    const handleEditCategory = (category: Category) => {
        setEditingCategory(category)
        setShowCategoryForm(true)
    }

    const handleDeleteCategory = (category: Category) => {
        setCategoryToDelete(category)
        setShowDeleteConfirm(true)
    }

    const confirmDelete = () => {
        if (categoryToDelete) {
            setCategories((prev) => prev.filter((cat) => cat.id !== categoryToDelete.id))
            setShowDeleteConfirm(false)
            setCategoryToDelete(null)
        }
    }

    const handleSaveCategory = (categoryData: Omit<Category, "id" | "totalRecipes" | "createdDate">) => {
        if (editingCategory) {
            // Update existing category
            setCategories((prev) =>
                prev.map((cat) =>
                    cat.id === editingCategory.id
                        ? { ...cat, name: categoryData.name, description: categoryData.description }
                        : cat,
                ),
            )
        } else {
            // Add new category
            const newCategory: Category = {
                id: Math.max(...categories.map((c) => c.id)) + 1,
                name: categoryData.name,
                description: categoryData.description,
                totalRecipes: 0,
                createdDate: new Date().toISOString().split("T")[0],
                isActive: true,
            }
            setCategories((prev) => [...prev, newCategory])
        }
    }

    const totalCategories = categories.length
    const activeCategories = categories.filter((cat) => cat.isActive).length

    return (
        <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-50 overflow-y-auto">
            {/* Modern Header with gradient */}
            <div className="relative bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100/50">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-50/30 to-transparent"></div>
                <div className="relative p-4 lg:p-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                                📂 Kategori Resep
                            </h1>
                            <p className="text-gray-600 text-base lg:text-lg">
                                Kelola kategori resep untuk mengorganisir menu dengan lebih baik
                            </p>
                        </div>
                        <div className="flex items-center space-x-6">
                            <div className="hidden md:flex items-center space-x-6">
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Total Kategori</p>
                                    <p className="text-xl lg:text-2xl font-bold text-gray-800">{totalCategories}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-success-600">Aktif</p>
                                    <p className="text-xl lg:text-2xl font-bold text-success-600">{activeCategories}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleAddCategory}
                                className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-4 lg:px-6 py-3 rounded-2xl font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 transform hover:scale-105"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Tambah Kategori</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 lg:p-8 space-y-6 lg:space-y-8">
                {/* Desktop Table */}
                {categories.length > 0 ? (
                    <>
                        <div className="hidden lg:block bg-white rounded-3xl shadow-sm border border-gray-100/50 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                                        <tr>
                                            <th className="text-left py-4 px-6 font-semibold text-gray-700">Nama Kategori</th>
                                            <th className="text-left py-4 px-6 font-semibold text-gray-700">Total Resep</th>
                                            <th className="text-left py-4 px-6 font-semibold text-gray-700">Dibuat Pada</th>
                                            <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                                            <th className="text-left py-4 px-6 font-semibold text-gray-700">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.map((category, index) => (
                                            <tr
                                                key={category.id}
                                                className={`border-t border-gray-100 hover:bg-gray-50/50 transition-colors duration-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                                                    }`}
                                            >
                                                <td className="py-4 px-6">
                                                    <div>
                                                        <div className="font-semibold text-gray-800 flex items-center space-x-2">
                                                            <span>{category.name}</span>
                                                            {category.isActive && (
                                                                <span className="w-2 h-2 bg-success-500 rounded-full" title="Kategori aktif"></span>
                                                            )}
                                                        </div>
                                                        {category.description && (
                                                            <div className="text-sm text-gray-500 mt-1">{category.description}</div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center space-x-2">
                                                        <Package className="w-4 h-4 text-gray-400" />
                                                        <span className="font-semibold text-gray-800">{category.totalRecipes} resep</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center space-x-2">
                                                        <Calendar className="w-4 h-4 text-gray-400" />
                                                        <span className="text-gray-700">{formatDate(category.createdDate)}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-sm font-semibold ${category.isActive
                                                                ? "bg-success-50 text-success-600 border border-success-200"
                                                                : "bg-gray-50 text-gray-600 border border-gray-200"
                                                            }`}
                                                    >
                                                        {category.isActive ? "Aktif" : "Tidak Aktif"}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleEditCategory(category)}
                                                            className="p-2 text-primary-600 hover:bg-primary-50 rounded-xl transition-colors duration-200"
                                                            title="Edit Kategori"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteCategory(category)}
                                                            disabled={category.totalRecipes > 0}
                                                            className={`p-2 rounded-xl transition-colors duration-200 ${category.totalRecipes > 0
                                                                    ? "text-gray-400 cursor-not-allowed"
                                                                    : "text-red-600 hover:bg-red-50"
                                                                }`}
                                                            title={
                                                                category.totalRecipes > 0
                                                                    ? "Tidak dapat menghapus kategori yang sedang digunakan"
                                                                    : "Hapus Kategori"
                                                            }
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
                            {categories.map((category) => (
                                <div key={category.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <h3 className="font-bold text-lg text-gray-800">{category.name}</h3>
                                                {category.isActive && (
                                                    <span className="w-2 h-2 bg-success-500 rounded-full" title="Kategori aktif"></span>
                                                )}
                                            </div>
                                            {category.description && <p className="text-sm text-gray-500 mb-2">{category.description}</p>}
                                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                <div className="flex items-center space-x-1">
                                                    <Package className="w-4 h-4" />
                                                    <span>{category.totalRecipes} resep</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{formatDate(category.createdDate)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${category.isActive
                                                    ? "bg-success-50 text-success-600 border border-success-200"
                                                    : "bg-gray-50 text-gray-600 border border-gray-200"
                                                }`}
                                        >
                                            {category.isActive ? "Aktif" : "Tidak Aktif"}
                                        </span>
                                    </div>

                                    <div className="flex space-x-3 pt-4 border-t border-gray-100">
                                        <button
                                            onClick={() => handleEditCategory(category)}
                                            className="flex-1 bg-primary-50 text-primary-600 py-2 px-4 rounded-xl font-semibold hover:bg-primary-100 transition-colors duration-200 flex items-center justify-center space-x-2"
                                        >
                                            <Edit className="w-4 h-4" />
                                            <span>Edit</span>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCategory(category)}
                                            disabled={category.totalRecipes > 0}
                                            className={`flex-1 py-2 px-4 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center space-x-2 ${category.totalRecipes > 0
                                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                    : "bg-red-50 text-red-600 hover:bg-red-100"
                                                }`}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            <span>Hapus</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    /* Empty State */
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100/50 p-12 text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Package className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Belum ada kategori</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Tambahkan kategori untuk mengelompokkan resep Anda dengan lebih baik dan terorganisir.
                        </p>
                        <button
                            onClick={handleAddCategory}
                            className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-200 flex items-center space-x-2 mx-auto shadow-lg shadow-primary-500/25"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Tambah Kategori Pertama</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Category Form Modal */}
            <CategoryForm
                isOpen={showCategoryForm}
                onClose={() => setShowCategoryForm(false)}
                category={editingCategory}
                onSave={handleSaveCategory}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDelete}
                title="Hapus Kategori"
                message={
                    categoryToDelete
                        ? `Apakah Anda yakin ingin menghapus kategori "${categoryToDelete.name}"? Tindakan ini tidak dapat dibatalkan.`
                        : ""
                }
                confirmText="Hapus"
                cancelText="Batal"
                type="danger"
            />
        </div>
    )
}

export default function CategoryListPage() {
    return (
        <div className="flex h-screen bg-gray-50 font-poppins">
            <Sidebar />
            <CategoryListContent />
        </div>
    )
}
