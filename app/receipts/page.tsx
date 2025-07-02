"use client"

import type React from "react"

import { useState } from "react"
import {
  Search,
  Upload,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  ImageIcon,
  Check,
  X,
  Clock,
  AlertTriangle,
} from "lucide-react"
import Sidebar from "../../components/sidebar"
import ReceiptDetailModal from "../../components/receipt-detail-modal"
import { useToast } from "@/hooks/use-toast"

interface Receipt {
  id: number
  uploadDate: string
  source: "WhatsApp" | "Telegram"
  imageUrl: string
  status: "Pending" | "Parsed" | "Gagal" | "Butuh Konfirmasi"
  pricesUpdated: boolean
  itemsFound?: number
  shopName?: string
  totalAmount?: number
}

const mockReceipts: Receipt[] = [
  {
    id: 1,
    uploadDate: "2024-06-30",
    source: "WhatsApp",
    imageUrl: "/placeholder.svg?height=200&width=300",
    status: "Parsed",
    pricesUpdated: true,
    itemsFound: 4,
    shopName: "Indomaret",
    totalAmount: 45000,
  },
  {
    id: 2,
    uploadDate: "2024-06-29",
    source: "Telegram",
    imageUrl: "/placeholder.svg?height=200&width=300",
    status: "Butuh Konfirmasi",
    pricesUpdated: false,
    itemsFound: 3,
    shopName: "Alfamart",
    totalAmount: 32000,
  },
  {
    id: 3,
    uploadDate: "2024-06-28",
    source: "WhatsApp",
    imageUrl: "/placeholder.svg?height=200&width=300",
    status: "Parsed",
    pricesUpdated: true,
    itemsFound: 6,
    shopName: "Pasar Tradisional",
    totalAmount: 78000,
  },
  {
    id: 4,
    uploadDate: "2024-06-27",
    source: "Telegram",
    imageUrl: "/placeholder.svg?height=200&width=300",
    status: "Gagal",
    pricesUpdated: false,
    itemsFound: 0,
    shopName: "Tidak Terdeteksi",
  },
  {
    id: 5,
    uploadDate: "2024-06-26",
    source: "WhatsApp",
    imageUrl: "/placeholder.svg?height=200&width=300",
    status: "Pending",
    pricesUpdated: false,
    shopName: "Hypermart",
  },
  {
    id: 6,
    uploadDate: "2024-06-25",
    source: "Telegram",
    imageUrl: "/placeholder.svg?height=200&width=300",
    status: "Parsed",
    pricesUpdated: true,
    itemsFound: 8,
    shopName: "Carrefour",
    totalAmount: 125000,
  },
]

const filterOptions = ["Semua", "Pending", "Parsed", "Butuh Konfirmasi", "Gagal"]
const sourceOptions = ["WhatsApp", "Telegram"]

function ReceiptHistoryContent() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("Semua")
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [showSourceDropdown, setShowSourceDropdown] = useState(false)
  const [receipts, setReceipts] = useState(mockReceipts)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // Upload form state
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [selectedSource, setSelectedSource] = useState("WhatsApp")
  const [shoppingDate, setShoppingDate] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const itemsPerPage = 10

  const filteredReceipts = receipts.filter((receipt) => {
    const matchesSearch =
      receipt.shopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.source.toLowerCase().includes(searchTerm.toLowerCase())

    if (selectedFilter === "Semua") {
      return matchesSearch
    }

    return matchesSearch && receipt.status === selectedFilter
  })

  const totalPages = Math.ceil(filteredReceipts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedReceipts = filteredReceipts.slice(startIndex, startIndex + itemsPerPage)

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

  const getStatusColor = (status: Receipt["status"]) => {
    switch (status) {
      case "Parsed":
        return "bg-success-100 text-success-700 border-success-200"
      case "Butuh Konfirmasi":
        return "bg-warning-100 text-warning-700 border-warning-200"
      case "Gagal":
        return "bg-danger-100 text-danger-700 border-danger-200"
      case "Pending":
        return "bg-gray-100 text-gray-700 border-gray-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getStatusIcon = (status: Receipt["status"]) => {
    switch (status) {
      case "Parsed":
        return <Check className="w-4 h-4" />
      case "Butuh Konfirmasi":
        return <AlertTriangle className="w-4 h-4" />
      case "Gagal":
        return <X className="w-4 h-4" />
      case "Pending":
        return <Clock className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "File tidak valid",
          description: "Harap pilih file gambar (JPG, PNG)",
          variant: "destructive",
        })
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File terlalu besar",
          description: "Ukuran file maksimal 5MB",
          variant: "destructive",
        })
        return
      }

      setUploadFile(file)
    }
  }

  const handleSubmitReceipt = async () => {
    if (!uploadFile) {
      toast({
        title: "File belum dipilih",
        description: "Harap pilih foto nota belanja terlebih dahulu",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    // Simulate upload process
    setTimeout(() => {
      const newReceipt: Receipt = {
        id: Math.max(...receipts.map((r) => r.id)) + 1,
        uploadDate: shoppingDate || new Date().toISOString().split("T")[0],
        source: selectedSource as "WhatsApp" | "Telegram",
        imageUrl: "/placeholder.svg?height=200&width=300",
        status: "Pending",
        pricesUpdated: false,
        shopName: "Sedang Diproses...",
      }

      setReceipts((prev) => [newReceipt, ...prev])

      // Reset form
      setUploadFile(null)
      setShoppingDate("")
      setIsUploading(false)

      // Reset file input
      const fileInput = document.getElementById("receipt-upload") as HTMLInputElement
      if (fileInput) {
        fileInput.value = ""
      }

      toast({
        title: "Nota berhasil dikirim untuk diproses",
        description: "Kami akan memproses nota Anda dalam beberapa menit",
        variant: "success",
      })
    }, 2000)
  }

  const handleViewDetail = (receipt: Receipt) => {
    setSelectedReceipt(receipt)
    setShowDetailModal(true)
  }

  const handleReprocess = (receipt: Receipt) => {
    toast({
      title: "Memproses ulang nota",
      description: `Nota dari ${receipt.shopName} akan diproses ulang`,
      variant: "default",
    })
    setShowDetailModal(false)
  }

  const handleConfirmItems = (receipt: Receipt) => {
    toast({
      title: "Item dikonfirmasi",
      description: `Item dari nota ${receipt.shopName} telah dikonfirmasi`,
      variant: "success",
    })
    setShowDetailModal(false)
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
                📤 Proses Nota Belanja
              </h1>
              <p className="text-gray-600 text-base lg:text-lg">
                Kirim foto nota belanja dan lacak riwayat parsing harga bahan
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Nota</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-800">{receipts.length}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-success-600">Berhasil Parsed</p>
                <p className="text-xl lg:text-2xl font-bold text-success-600">
                  {receipts.filter((r) => r.status === "Parsed").length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-8 space-y-6 lg:space-y-8">
        {/* Upload Section */}
        <div className="bg-white rounded-2xl lg:rounded-3xl p-6 shadow-sm border border-gray-100/50">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
            <Upload className="w-6 h-6 text-primary-600" />
            <span>Kirim Nota Belanja</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Area */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Foto Nota Belanja <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="receipt-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="receipt-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImageIcon className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Klik untuk upload</span> atau drag & drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG (MAX. 5MB)</p>
                  </div>
                </label>
              </div>
              {uploadFile && (
                <div className="mt-2 p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-sm text-blue-700 font-medium">File terpilih: {uploadFile.name}</p>
                  <p className="text-xs text-blue-600">Ukuran: {(uploadFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Source Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sumber <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowSourceDropdown(!showSourceDropdown)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 flex items-center justify-between"
                  >
                    <span className="text-gray-700">{selectedSource}</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {showSourceDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-10">
                      {sourceOptions.map((source) => (
                        <button
                          key={source}
                          type="button"
                          onClick={() => {
                            setSelectedSource(source)
                            setShowSourceDropdown(false)
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 first:rounded-t-2xl last:rounded-b-2xl transition-colors duration-200"
                        >
                          {source}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Shopping Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal Belanja (Opsional)</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    value={shoppingDate}
                    onChange={(e) => setShoppingDate(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Kosongkan untuk menggunakan tanggal hari ini</p>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmitReceipt}
                disabled={isUploading}
                className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-primary-500/25 disabled:shadow-none"
              >
                {isUploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span>Kirim dan Proses</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm border border-gray-100/50">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">📊 Riwayat Nota Belanja</h2>

            <div className="flex flex-col sm:flex-row gap-4 flex-1 lg:max-w-md">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari nota..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="flex items-center justify-between w-full sm:w-40 px-4 py-3 border border-gray-200 rounded-2xl bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
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
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Tanggal Kirim</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Sumber</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Gambar</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Harga Terupdate</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedReceipts.map((receipt, index) => (
                    <tr
                      key={receipt.id}
                      className={`border-t border-gray-100 hover:bg-gray-50/50 transition-colors duration-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                        }`}
                    >
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-semibold text-gray-800">{formatDate(receipt.uploadDate)}</div>
                          {receipt.shopName && <div className="text-sm text-gray-500">{receipt.shopName}</div>}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                          {receipt.source}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <button onClick={() => setSelectedImage(receipt.imageUrl)} className="relative group">
                          <img
                            src={receipt.imageUrl || "/placeholder.svg"}
                            alt="Receipt thumbnail"
                            className="w-16 h-12 object-cover rounded-lg border border-gray-200 group-hover:shadow-md transition-shadow duration-200"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-colors duration-200 flex items-center justify-center">
                            <Eye className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          </div>
                        </button>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(receipt.status)}`}
                        >
                          {getStatusIcon(receipt.status)}
                          <span className="ml-1">{receipt.status}</span>
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {receipt.pricesUpdated ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-success-100 text-success-700 border border-success-200">
                            <Check className="w-3 h-3 mr-1" />
                            Ya
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                            <X className="w-3 h-3 mr-1" />
                            Tidak
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleViewDetail(receipt)}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-xl transition-colors duration-200"
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
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
            {paginatedReceipts.map((receipt) => (
              <div key={receipt.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{formatDate(receipt.uploadDate)}</h3>
                    <p className="text-sm text-gray-500">{receipt.shopName}</p>
                  </div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(receipt.status)}`}
                  >
                    {getStatusIcon(receipt.status)}
                    <span className="ml-1">{receipt.status}</span>
                  </span>
                </div>

                <div className="flex items-center space-x-4 mb-4">
                  <button onClick={() => setSelectedImage(receipt.imageUrl)} className="relative group">
                    <img
                      src={receipt.imageUrl || "/placeholder.svg"}
                      alt="Receipt thumbnail"
                      className="w-20 h-16 object-cover rounded-lg border border-gray-200 group-hover:shadow-md transition-shadow duration-200"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-colors duration-200 flex items-center justify-center">
                      <Eye className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>
                  </button>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Sumber:</span>
                      <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                        {receipt.source}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Harga Terupdate:</span>
                      {receipt.pricesUpdated ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-success-100 text-success-700 border border-success-200">
                          <Check className="w-3 h-3 mr-1" />
                          Ya
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                          <X className="w-3 h-3 mr-1" />
                          Tidak
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleViewDetail(receipt)}
                    className="w-full bg-primary-50 text-primary-600 py-2 px-4 rounded-xl font-semibold hover:bg-primary-100 transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Lihat Detail</span>
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

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-3xl overflow-hidden">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImage || "/placeholder.svg"}
              alt="Receipt preview"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}

      {/* Receipt Detail Modal */}
      <ReceiptDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        receipt={selectedReceipt}
        onReprocess={handleReprocess}
        onConfirmItems={handleConfirmItems}
      />
    </div>
  )
}

export default function ReceiptHistoryPage() {
  return (
    <div className="flex h-screen bg-gray-50 font-poppins">
      <Sidebar />
      <ReceiptHistoryContent />
    </div>
  )
}
