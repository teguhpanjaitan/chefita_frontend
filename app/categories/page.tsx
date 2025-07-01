"use client"

import { useState } from "react"
import {
  Plus,
  Edit,
  Calendar,
  Package,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react"
import Sidebar from "../../components/sidebar"
import CategoryForm from "../../components/category-form"
import ConfirmDialog from "../../components/confirm-dialog"

interface Category {
  id: number
  name: string
  totalRecipes: number
  createdDate: string
  description?: string
  isActive: boolean
}

/* ---- MOCK DATA --------------------------------------------------------- */
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

/* ---- MAIN CONTENT COMPONENT ------------------------------------------- */
function CategoryListContent() {
  /* ---------- state ---------- */
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"Semua" | "Aktif" | "Tidak Aktif">("Semua")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)

  /* ---------- modal state ---------- */
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)

  /* ---------- helpers ---------- */
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })

  /* ---------- filter & pagination ---------- */
  const filtered = categories.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus =
      statusFilter === "Semua" ||
      (statusFilter === "Aktif" ? c.isActive : !c.isActive)
    return matchSearch && matchStatus
  })
  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const startIdx = (currentPage - 1) * itemsPerPage
  const paginated = filtered.slice(startIdx, startIdx + itemsPerPage)

  /* ---------- actions ---------- */
  const handleAdd = () => {
    setEditingCategory(null)
    setShowCategoryForm(true)
  }
  const handleEdit = (c: Category) => {
    setEditingCategory(c)
    setShowCategoryForm(true)
  }
  const handleDelete = (c: Category) => {
    setCategoryToDelete(c)
    setShowDeleteConfirm(true)
  }
  const confirmDelete = () => {
    if (categoryToDelete) {
      setCategories((prev) => prev.filter((x) => x.id !== categoryToDelete.id))
      setCategoryToDelete(null)
      setShowDeleteConfirm(false)
    }
  }
  const handleSave = (data: Omit<Category, "id" | "totalRecipes" | "createdDate">) => {
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id ? { ...c, ...data } : c,
        ),
      )
    } else {
      const newCat: Category = {
        id: Math.max(...categories.map((c) => c.id)) + 1,
        name: data.name,
        description: data.description,
        totalRecipes: 0,
        createdDate: new Date().toISOString().split("T")[0],
        isActive: true,
      }
      setCategories((prev) => [...prev, newCat])
    }
  }

  /* ---------- stats ---------- */
  const total = categories.length
  const active = categories.filter((c) => c.isActive).length

  /* ---------- UI ---------- */
  return (
    <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-50 overflow-y-auto">
      {/* HEADER */}
      <div className="relative bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100/50">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-50/30 to-transparent" />
        <div className="relative p-4 lg:p-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-1">
              📂 Kategori Resep
            </h1>
            <p className="text-gray-600 text-base lg:text-lg">
              Kelola kategori resep untuk mengorganisir menu
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Stat label="Total Kategori" value={total} />
            <Stat label="Aktif" value={active} color="success" />
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="p-8 space-y-8">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/50 flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-4 sm:gap-0 justify-between">
          {/* search + status in same group */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 flex-1">
            {/* search */}
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama kategori..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* status filter */}
            <div className="relative mt-2 sm:mt-0">
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="flex items-center justify-between w-44 px-4 py-3 border border-gray-200 rounded-2xl bg-white hover:bg-gray-50"
              >
                <span className="text-gray-700">{statusFilter}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {showStatusDropdown && (
                <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-10">
                  {["Semua", "Aktif", "Tidak Aktif"].map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setStatusFilter(s as any)
                        setShowStatusDropdown(false)
                        setCurrentPage(1)
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 first:rounded-t-2xl last:rounded-b-2xl"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* add button */}
          <button
            onClick={handleAdd}
            className="flex-shrink-0 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-5 py-3 rounded-2xl font-semibold flex items-center space-x-2 shadow-lg shadow-primary-500/25"
          >
            <Plus className="w-5 h-5" />
            <span>Tambah Kategori</span>
          </button>
        </div>

      {/* CONTENT */}
        {filtered.length ? (
          <>
            {/* DESKTOP TABLE */}
            <DesktopTable
              data={paginated}
              onEdit={handleEdit}
              onDelete={handleDelete}
              formatDate={formatDate}
            />
            {/* MOBILE CARDS */}
            <MobileCards
              data={paginated}
              onEdit={handleEdit}
              onDelete={handleDelete}
              formatDate={formatDate}
            />
            {/* PAGINATION */}
            {totalPages > 1 && (
              <Pagination
                current={currentPage}
                total={totalPages}
                onChange={setCurrentPage}
              />
            )}
          </>
        ) : (
          <EmptyState onAdd={handleAdd} />
        )}
      </div>

      {/* MODALS */}
      <CategoryForm
        isOpen={showCategoryForm}
        category={editingCategory}
        onClose={() => setShowCategoryForm(false)}
        onSave={handleSave}
      />
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Hapus Kategori"
        message={
          categoryToDelete
            ? `Apakah Anda yakin ingin menghapus kategori "${categoryToDelete.name}"?`
            : ""
        }
        confirmText="Hapus"
        cancelText="Batal"
        type="danger"
      />
    </div>
  )
}

/* ---- SMALL PRESENTATIONAL COMPONENTS ---------------------------------- */
const Stat = ({ label, value, color = "gray" }: any) => (
  <div className="text-right">
    <p className="text-sm text-gray-500">{label}</p>
    <p
      className={`text-xl lg:text-2xl font-bold ${color === "success" ? "text-success-600" : "text-gray-800"
        }`}
    >
      {value}
    </p>
  </div>
)

/* Desktop table */
const DesktopTable = ({ data, onEdit, onDelete, formatDate }: any) => (
  <div className="hidden lg:block bg-white rounded-3xl shadow-sm border border-gray-100/50 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
          <tr>
            {["Nama Kategori", "Total Resep", "Dibuat Pada", "Status", "Aksi"].map((h) => (
              <th key={h} className="text-left py-4 px-6 font-semibold text-gray-700">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((cat: Category, i: number) => (
            <tr
              key={cat.id}
              className={`border-t border-gray-100 hover:bg-gray-50/50 ${i % 2 ? "bg-gray-50/30" : "bg-white"
                }`}
            >
              <td className="py-4 px-6">
                <div className="font-semibold text-gray-800 flex items-center space-x-2">
                  <span>{cat.name}</span>
                  {cat.isActive && <span className="w-2 h-2 bg-success-500 rounded-full" />}
                </div>
                {cat.description && (
                  <div className="text-sm text-gray-500">{cat.description}</div>
                )}
              </td>
              <td className="py-4 px-6">
                <Package className="w-4 h-4 inline mr-1 text-gray-400" />
                <span className="font-semibold text-gray-800">{cat.totalRecipes} resep</span>
              </td>
              <td className="py-4 px-6">
                <Calendar className="w-4 h-4 inline mr-1 text-gray-400" />
                <span className="text-gray-700">{formatDate(cat.createdDate)}</span>
              </td>
              <td className="py-4 px-6">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${cat.isActive
                    ? "bg-success-50 text-success-600 border border-success-200"
                    : "bg-gray-50 text-gray-600 border border-gray-200"
                    }`}
                >
                  {cat.isActive ? "Aktif" : "Tidak Aktif"}
                </span>
              </td>
              <td className="py-4 px-6">
                <div className="flex space-x-2">
                  <IconBtn icon={Edit} onClick={() => onEdit(cat)} color="primary" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

/* Mobile cards */
const MobileCards = ({ data, onEdit, onDelete, formatDate }: any) => (
  <div className="lg:hidden space-y-4">
    {data.map((cat: Category) => (
      <div key={cat.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-bold text-lg text-gray-800">{cat.name}</h3>
              {cat.isActive && <span className="w-2 h-2 bg-success-500 rounded-full" />}
            </div>
            {cat.description && <p className="text-sm text-gray-500 mb-2">{cat.description}</p>}
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <StatLine icon={Package} text={`${cat.totalRecipes} resep`} />
              <StatLine icon={Calendar} text={formatDate(cat.createdDate)} />
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${cat.isActive
              ? "bg-success-50 text-success-600 border border-success-200"
              : "bg-gray-50 text-gray-600 border border-gray-200"
              }`}
          >
            {cat.isActive ? "Aktif" : "Tidak Aktif"}
          </span>
        </div>
        <div className="flex space-x-3 pt-4 border-t border-gray-100">
          <ActionBtn text="Edit" icon={Edit} onClick={() => onEdit(cat)} />
        </div>
      </div>
    ))}
  </div>
)

/* ---- UTIL COMPONENTS --------------------------------------------------- */
const IconBtn = ({ icon: Icon, color, ...rest }: any) => (
  <button
    {...rest}
    className={`p-2 rounded-xl transition-colors duration-200 ${rest.disabled
      ? "text-gray-400 cursor-not-allowed"
      : color === "red"
        ? "text-red-600 hover:bg-red-50"
        : "text-primary-600 hover:bg-primary-50"
      }`}
  >
    <Icon className="w-4 h-4" />
  </button>
)
const ActionBtn = ({ text, icon: Icon, red = false, ...rest }: any) => (
  <button
    {...rest}
    className={`flex-1 py-2 px-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-colors duration-200 ${red
      ? rest.disabled
        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
        : "bg-red-50 text-red-600 hover:bg-red-100"
      : "bg-primary-50 text-primary-600 hover:bg-primary-100"
      }`}
  >
    <Icon className="w-4 h-4" />
    <span>{text}</span>
  </button>
)
const StatLine = ({ icon: Icon, text }: any) => (
  <div className="flex items-center space-x-1">
    <Icon className="w-4 h-4" />
    <span>{text}</span>
  </div>
)

/* Pagination */
const Pagination = ({ current, total, onChange }: any) => (
  <div className="flex justify-center items-center space-x-4">
    <PageBtn disabled={current === 1} onClick={() => onChange(current - 1)}>
      <ChevronLeft className="w-5 h-5" />
    </PageBtn>
    <div className="flex space-x-2">
      {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`w-10 h-10 rounded-xl font-semibold ${current === p
            ? "bg-primary-500 text-white"
            : "border border-gray-200 hover:bg-gray-50"
            }`}
        >
          {p}
        </button>
      ))}
    </div>
    <PageBtn disabled={current === total} onClick={() => onChange(current + 1)}>
      <ChevronRight className="w-5 h-5" />
    </PageBtn>
  </div>
)
const PageBtn = ({ disabled, children, ...rest }: any) => (
  <button
    disabled={disabled}
    {...rest}
    className={`p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed`}
  >
    {children}
  </button>
)

/* Empty state */
const EmptyState = ({ onAdd }: any) => (
  <div className="bg-white rounded-3xl shadow-sm border border-gray-100/50 p-12 text-center">
    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
      <Package className="w-12 h-12 text-gray-400" />
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">Belum ada kategori</h3>
    <p className="text-gray-600 mb-6 max-w-md mx-auto">
      Tambahkan kategori untuk mengelompokkan resep Anda dengan lebih baik.
    </p>
    <button
      onClick={onAdd}
      className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-2xl font-semibold flex items-center space-x-2 mx-auto shadow-lg shadow-primary-500/25"
    >
      <Plus className="w-5 h-5" />
      <span>Tambah Kategori Pertama</span>
    </button>
  </div>
)

/* ---- PAGE WRAPPER ------------------------------------------------------ */
export default function CategoryListPage() {
  return (
    <div className="flex h-screen bg-gray-50 font-poppins">
      <Sidebar />
      <CategoryListContent />
    </div>
  )
}
