"use client"

import { useState } from "react"
import {
  MessageCircle,
  Phone,
  Eye,
  Filter,
  Calendar,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Receipt,
  Clock,
  FileImage,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search
} from "lucide-react"
import Sidebar from "../../components/sidebar"

/* ----------------------------------------------------------------------- */
/* MOCK DATA – (tetap)                                                     */
/* ----------------------------------------------------------------------- */
interface ReceiptRecord {
  id: number
  dateSent: string
  totalItems: number
  parsingStatus: "success" | "warning" | "error"
  priceUpdated: boolean
  imageUrl?: string
  parsedItems?: { name: string; price: number; updated: boolean }[]
}
const mockReceipts: ReceiptRecord[] = [
  {
    id: 1,
    dateSent: "2025-06-30",
    totalItems: 8,
    parsingStatus: "success",
    priceUpdated: true,
    imageUrl: "/placeholder.svg?height=200&width=300",
    parsedItems: [
      { name: "Beras Premium", price: 15000, updated: true },
      { name: "Minyak Goreng", price: 25000, updated: true },
      { name: "Gula Pasir", price: 12000, updated: true },
      { name: "Telur Ayam", price: 28000, updated: true },
      { name: "Daging Sapi", price: 120000, updated: true },
      { name: "Cabai Merah", price: 35000, updated: true },
      { name: "Bawang Merah", price: 18000, updated: true },
      { name: "Tomat", price: 8000, updated: true },
    ],
  },
  {
    id: 2,
    dateSent: "2025-06-29",
    totalItems: 5,
    parsingStatus: "warning",
    priceUpdated: false,
    imageUrl: "/placeholder.svg?height=200&width=300",
    parsedItems: [
      { name: "Ayam Potong", price: 45000, updated: false },
      { name: "Kentang", price: 12000, updated: true },
      { name: "Wortel", price: 8000, updated: true },
      { name: "Buncis", price: 15000, updated: false },
      { name: "Bayam", price: 5000, updated: true },
    ],
  },
  {
    id: 3,
    dateSent: "2025-06-28",
    totalItems: 10,
    parsingStatus: "success",
    priceUpdated: true,
    imageUrl: "/placeholder.svg?height=200&width=300",
    parsedItems: [
      { name: "Tepung Terigu", price: 18000, updated: true },
      { name: "Mentega", price: 32000, updated: true },
      { name: "Susu Cair", price: 15000, updated: true },
      { name: "Keju Parut", price: 45000, updated: true },
      { name: "Jamur Kancing", price: 22000, updated: true },
      { name: "Paprika", price: 28000, updated: true },
      { name: "Brokoli", price: 18000, updated: true },
      { name: "Kacang Polong", price: 12000, updated: true },
      { name: "Jagung Manis", price: 8000, updated: true },
      { name: "Saus Tomat", price: 15000, updated: true },
    ],
  },
]

/* ----------------------------------------------------------------------- */
/* DETAIL MODAL  (tidak ada perubahan)                                     */
/* ----------------------------------------------------------------------- */
function ReceiptDetailModal({
  receipt,
  isOpen,
  onClose,
}: {
  receipt: ReceiptRecord | null
  isOpen: boolean
  onClose: () => void
}) {
  if (!isOpen || !receipt) return null

  const updatedCount = receipt.parsedItems?.filter((item) => item.updated).length || 0
  const totalCount = receipt.parsedItems?.length || 0

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Detail Nota Belanja</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200">
              <XCircle className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <p className="text-gray-600 mt-1">
            Dikirim pada{" "}
            {new Date(receipt.dateSent).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Receipt Image */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
              <FileImage className="w-5 h-5" />
              <span>Foto Nota</span>
            </h3>
            <div className="bg-white rounded-xl p-4 border-2 border-dashed border-gray-200">
              <img
                src={receipt.imageUrl || "/placeholder.svg"}
                alt="Receipt"
                className="w-full max-w-sm mx-auto rounded-lg shadow-sm"
              />
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{totalCount}</div>
              <div className="text-sm text-blue-600">Total Item</div>
            </div>
            <div className="bg-green-50 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{updatedCount}</div>
              <div className="text-sm text-green-600">Berhasil Update</div>
            </div>
            <div className="bg-yellow-50 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{totalCount - updatedCount}</div>
              <div className="text-sm text-yellow-600">Perlu Verifikasi</div>
            </div>
          </div>

          {/* Parsed Items */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <Receipt className="w-5 h-5" />
              <span>Hasil Parsing Bahan</span>
            </h3>
            <div className="space-y-3">
              {receipt.parsedItems?.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${item.updated ? "bg-green-500" : "bg-yellow-500"}`}></div>
                    <div>
                      <div className="font-medium text-gray-800">{item.name}</div>
                      <div className="text-sm text-gray-500">Rp {item.price.toLocaleString("id-ID")}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {item.updated ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        ✅ Updated
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                        ⏳ Pending
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------------- */
/* MAIN CONTENT                                                            */
/* ----------------------------------------------------------------------- */
function ReceiptsContent() {
  const [receipts] = useState(mockReceipts)
  const [statusFilter, setStatusFilter] = useState<"all" | "success" | "warning" | "error">("all")
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptRecord | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  /* ▶ pagination state */
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)

  /* ▶ WHATSAPP util */
  const whatsappNumber = "+62812-3456-7890"
  const whatsappMessage = encodeURIComponent(
    "Halo Chefita! Saya ingin mengirim foto nota belanja untuk update harga bahan."
  )
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${whatsappMessage}`

  /* ▶ FILTER & PAGINATE */
  const filteredReceipts = receipts.filter((r) =>
    statusFilter === "all" ? true : r.parsingStatus === statusFilter
  )
  const totalPages = Math.ceil(filteredReceipts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedReceipts = filteredReceipts.slice(startIndex, startIndex + itemsPerPage)

  /* ▶ helpers */
  const getStatusBadge = (status: ReceiptRecord["parsingStatus"]) => { /* sama */ }
  const handleViewDetail = (r: ReceiptRecord) => { setSelectedReceipt(r); setIsDetailModalOpen(true) }

  /* ---------- stats ---------- */
  const total = receipts.length

  /* ------------------------------------------------------------------- */
  return (
    <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-50 overflow-y-auto">
      {/* HEADER */}
      <div className="relative bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100/50">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-50/30 to-transparent" />
        <div className="relative p-4 lg:p-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
              📲 Kirim & Riwayat Nota Belanja
            </h1>
            <p className="text-gray-600 text-base lg:text-lg">
              Kirim foto nota belanja via WhatsApp untuk update harga otomatis
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Stat label="Total Riwayat" value={total} />
          </div>
        </div>
      </div>

      {/* WhatsApp banner & divider – identik */}

      {/* FILTER BAR */}
      <div className="p-4 lg:p-8 space-y-6 lg:space-y-8">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/50 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0">
          {/* SEARCH + STATUS */}
          <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            {/* SEARCH INPUT */}
            <div className="relative flex-1 sm:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama nota atau bahan..."
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
                  {["All", "Success", "Warning", "Error"].map((s) => (
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

        </div>

        {/* RECEIPTS LIST */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100/50 overflow-hidden mt-8">
          {/* DESKTOP TABLE */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                <tr>
                  {["Tanggal Kirim", "Total Item", "Status Parsing", "Diupdate?", "Aksi"].map(h => (
                    <th key={h} className="text-left py-4 px-6 font-semibold text-gray-700">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedReceipts.map((r, i) => (
                  <tr key={r.id} className={`border-t border-gray-100 hover:bg-gray-50/50 ${i % 2 ? "bg-gray-50/30" : "bg-white"}`}>
                    <td className="py-4 px-6 font-medium text-gray-800">
                      {new Date(r.dateSent).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="py-4 px-6 font-semibold">{r.totalItems} bahan</td>
                    <td className="py-4 px-6">{getStatusBadge(r.parsingStatus)}</td>
                    <td className="py-4 px-6">
                      {r.priceUpdated
                        ? <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">✅ Ya</span>
                        : <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">❌ Tidak</span>}
                    </td>
                    <td className="py-4 px-6">
                      <button onClick={() => handleViewDetail(r)}
                        className="px-4 py-2 bg-primary-50 text-primary-600 rounded-xl hover:bg-primary-100 flex items-center space-x-2">
                        <Eye className="w-4 h-4" /><span>Lihat Detail</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}
          <div className="lg:hidden space-y-4 p-4">
            {paginatedReceipts.map(r => (
              <div key={r.id} className="bg-gray-50 rounded-2xl p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="font-bold text-gray-800 mb-1">
                      {new Date(r.dateSent).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                    </div>
                    <div className="text-sm text-gray-600">{r.totalItems} bahan</div>
                  </div>
                  {r.priceUpdated
                    ? <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">✅ Updated</span>
                    : <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">❌ Belum</span>}
                </div>
                {getStatusBadge(r.parsingStatus)}
                <button onClick={() => handleViewDetail(r)}
                  className="w-full mt-4 bg-primary-50 text-primary-600 py-3 rounded-xl font-semibold hover:bg-primary-100 flex items-center justify-center space-x-2">
                  <Eye className="w-4 h-4" /><span>Lihat Detail</span>
                </button>
              </div>
            ))}
          </div>

          {/* EMPTY STATE */}
          {filteredReceipts.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center">
                <Receipt className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Belum ada nota</h3>
              <p className="text-gray-600">Kirim foto nota pertama via WhatsApp untuk memulai.</p>
            </div>
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 my-8">
            <PageBtn disabled={currentPage === 1} onClick={() => setCurrentPage(c => c - 1)}>
              <ChevronLeft className="w-5 h-5" />
            </PageBtn>
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setCurrentPage(p)}
                  className={`w-10 h-10 rounded-xl font-semibold ${currentPage === p ? "bg-primary-500 text-white" : "border border-gray-200 hover:bg-gray-50"
                    }`}>
                  {p}
                </button>
              ))}
            </div>
            <PageBtn disabled={currentPage === totalPages} onClick={() => setCurrentPage(c => c + 1)}>
              <ChevronRight className="w-5 h-5" />
            </PageBtn>
          </div>
        )}

        {/* MODAL */}
        <ReceiptDetailModal receipt={selectedReceipt} isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} />
      </div >
    </div >
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

/* SMALL UTILS */
const PageBtn = ({ disabled, children, ...rest }: any) => (
  <button disabled={disabled} {...rest}
    className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
    {children}
  </button>
)

/* ----------------------------------------------------------------------- */
export default function ReceiptsPage() {
  return (
    <div className="flex h-screen bg-gray-50 font-poppins">
      <Sidebar />
      <ReceiptsContent />
    </div>
  )
}
