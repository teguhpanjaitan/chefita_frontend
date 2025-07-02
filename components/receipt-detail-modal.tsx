"use client"

import {
  X,
  Calendar,
  MessageSquare,
  ImageIcon,
  Check,
  AlertTriangle,
  Clock,
  XCircle,
  Eye,
  Download,
  RefreshCw,
} from "lucide-react"

interface ReceiptItem {
  id: number
  name: string
  quantity: number
  unit: string
  price: number
  originalText?: string
  confidence?: number
}

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
  items?: ReceiptItem[]
  processingTime?: string
  errorMessage?: string
  notes?: string
}

interface ReceiptDetailModalProps {
  isOpen: boolean
  onClose: () => void
  receipt: Receipt | null
  onReprocess?: (receipt: Receipt) => void
  onConfirmItems?: (receipt: Receipt) => void
}

// Mock detailed receipt items
const getMockReceiptItems = (receiptId: number): ReceiptItem[] => {
  const itemSets = {
    1: [
      {
        id: 1,
        name: "Beras Premium",
        quantity: 5,
        unit: "kg",
        price: 15000,
        originalText: "BERAS PREM 5KG",
        confidence: 95,
      },
      {
        id: 2,
        name: "Minyak Goreng",
        quantity: 2,
        unit: "liter",
        price: 14000,
        originalText: "MINYAK GRG 2L",
        confidence: 88,
      },
      {
        id: 3,
        name: "Gula Pasir",
        quantity: 1,
        unit: "kg",
        price: 12000,
        originalText: "GULA PASIR 1KG",
        confidence: 92,
      },
      {
        id: 4,
        name: "Telur Ayam",
        quantity: 1,
        unit: "kg",
        price: 4000,
        originalText: "TELUR AYAM 1KG",
        confidence: 85,
      },
    ],
    2: [
      {
        id: 5,
        name: "Daging Sapi",
        quantity: 0.5,
        unit: "kg",
        price: 25000,
        originalText: "DGG SAPI 500G",
        confidence: 78,
      },
      {
        id: 6,
        name: "Bawang Merah",
        quantity: 0.25,
        unit: "kg",
        price: 4000,
        originalText: "BWG MRH 250G",
        confidence: 82,
      },
      {
        id: 7,
        name: "Cabai Merah",
        quantity: 0.1,
        unit: "kg",
        price: 3000,
        originalText: "CABAI MRH 100G",
        confidence: 90,
      },
    ],
    3: [
      {
        id: 8,
        name: "Ayam Potong",
        quantity: 1,
        unit: "ekor",
        price: 35000,
        originalText: "AYAM PTNG 1EKR",
        confidence: 94,
      },
      { id: 9, name: "Kentang", quantity: 1, unit: "kg", price: 8000, originalText: "KENTANG 1KG", confidence: 87 },
      { id: 10, name: "Wortel", quantity: 0.5, unit: "kg", price: 5000, originalText: "WORTEL 500G", confidence: 91 },
      { id: 11, name: "Buncis", quantity: 0.3, unit: "kg", price: 6000, originalText: "BUNCIS 300G", confidence: 89 },
      { id: 12, name: "Tomat", quantity: 0.5, unit: "kg", price: 7000, originalText: "TOMAT 500G", confidence: 86 },
      {
        id: 13,
        name: "Bawang Putih",
        quantity: 0.1,
        unit: "kg",
        price: 3000,
        originalText: "BWG PTH 100G",
        confidence: 93,
      },
    ],
  }

  return itemSets[receiptId as keyof typeof itemSets] || []
}

export default function ReceiptDetailModal({
  isOpen,
  onClose,
  receipt,
  onReprocess,
  onConfirmItems,
}: ReceiptDetailModalProps) {
  if (!isOpen || !receipt) return null

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
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: Receipt["status"]) => {
    switch (status) {
      case "Parsed":
        return "text-success-600 bg-success-50 border-success-200"
      case "Butuh Konfirmasi":
        return "text-warning-600 bg-warning-50 border-warning-200"
      case "Gagal":
        return "text-danger-600 bg-danger-50 border-danger-200"
      case "Pending":
        return "text-gray-600 bg-gray-50 border-gray-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getStatusIcon = (status: Receipt["status"]) => {
    switch (status) {
      case "Parsed":
        return <Check className="w-5 h-5" />
      case "Butuh Konfirmasi":
        return <AlertTriangle className="w-5 h-5" />
      case "Gagal":
        return <XCircle className="w-5 h-5" />
      case "Pending":
        return <Clock className="w-5 h-5" />
      default:
        return <Clock className="w-5 h-5" />
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-success-600 bg-success-50"
    if (confidence >= 80) return "text-warning-600 bg-warning-50"
    return "text-danger-600 bg-danger-50"
  }

  const receiptItems = getMockReceiptItems(receipt.id)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-primary-50 to-primary-100/50 p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/25">
                <ImageIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Detail Nota Belanja</h2>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-sm text-gray-600">{receipt.shopName}</span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-600">{formatDate(receipt.uploadDate)}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold border flex items-center space-x-1 ${getStatusColor(receipt.status)}`}
                  >
                    {getStatusIcon(receipt.status)}
                    <span>{receipt.status}</span>
                  </span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/80 rounded-xl transition-colors duration-200">
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-8">
            {/* Receipt Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-4 border border-blue-200/50">
                <div className="flex items-center space-x-3 mb-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-800">Sumber</h3>
                </div>
                <p className="text-lg font-bold text-blue-600">{receipt.source}</p>
              </div>

              <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-2xl p-4 border border-primary-200/50">
                <div className="flex items-center space-x-3 mb-2">
                  <Calendar className="w-5 h-5 text-primary-600" />
                  <h3 className="font-semibold text-gray-800">Tanggal Upload</h3>
                </div>
                <p className="text-lg font-bold text-primary-600">{formatDate(receipt.uploadDate)}</p>
              </div>

              <div className="bg-gradient-to-br from-success-50 to-success-100/50 rounded-2xl p-4 border border-success-200/50">
                <div className="flex items-center space-x-3 mb-2">
                  <Check className="w-5 h-5 text-success-600" />
                  <h3 className="font-semibold text-gray-800">Item Ditemukan</h3>
                </div>
                <p className="text-lg font-bold text-success-600">{receiptItems.length} item</p>
              </div>

              <div className="bg-gradient-to-br from-warning-50 to-warning-100/50 rounded-2xl p-4 border border-warning-200/50">
                <div className="flex items-center space-x-3 mb-2">
                  <RefreshCw className="w-5 h-5 text-warning-600" />
                  <h3 className="font-semibold text-gray-800">Total Belanja</h3>
                </div>
                <p className="text-lg font-bold text-warning-600">
                  {receipt.totalAmount ? formatCurrency(receipt.totalAmount) : "Tidak Terdeteksi"}
                </p>
              </div>
            </div>

            {/* Receipt Image */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 p-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                  <ImageIcon className="w-5 h-5" />
                  <span>Foto Nota Belanja</span>
                </h3>
              </div>
              <div className="p-6 flex justify-center">
                <div className="relative max-w-md">
                  <img
                    src={receipt.imageUrl || "/placeholder.svg?height=400&width=300&query=receipt"}
                    alt="Receipt"
                    className="w-full rounded-xl shadow-lg border border-gray-200"
                  />
                  <button className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors duration-200">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Parsed Items */}
            {receiptItems.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 p-4 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                    <Check className="w-5 h-5" />
                    <span>Item yang Terdeteksi ({receiptItems.length} item)</span>
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Nama Bahan</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Jumlah</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Satuan</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Harga</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Teks Asli</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700">Akurasi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {receiptItems.map((item, index) => (
                        <tr
                          key={item.id}
                          className={`border-t border-gray-100 hover:bg-gray-50/50 transition-colors duration-200 ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                          }`}
                        >
                          <td className="py-3 px-4">
                            <span className="font-medium text-gray-800">{item.name}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-gray-700">{item.quantity}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-gray-700">{item.unit}</span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="font-semibold text-gray-800">{formatCurrency(item.price)}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-mono text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                              {item.originalText}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getConfidenceColor(item.confidence || 0)}`}
                            >
                              {item.confidence}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Status-specific content */}
            {receipt.status === "Gagal" && (
              <div className="bg-gradient-to-r from-red-50 to-red-100/50 rounded-2xl p-6 border border-red-200/50">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span>❌ Gagal Memproses</span>
                </h3>
                <p className="text-red-700 mb-4">
                  {receipt.errorMessage ||
                    "Foto nota tidak dapat dibaca dengan jelas. Pastikan foto memiliki kualitas yang baik dan teks dapat terbaca dengan jelas."}
                </p>
                <div className="bg-white rounded-xl p-4 border border-red-200/30">
                  <h4 className="font-semibold text-gray-800 mb-2">💡 Tips untuk foto yang lebih baik:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Pastikan pencahayaan cukup terang</li>
                    <li>• Foto harus fokus dan tidak blur</li>
                    <li>• Seluruh nota harus terlihat dalam frame</li>
                    <li>• Hindari bayangan atau pantulan cahaya</li>
                  </ul>
                </div>
              </div>
            )}

            {receipt.status === "Butuh Konfirmasi" && (
              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100/50 rounded-2xl p-6 border border-yellow-200/50">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span>⚠️ Butuh Konfirmasi</span>
                </h3>
                <p className="text-yellow-700 mb-4">
                  Beberapa item memiliki tingkat akurasi rendah dan membutuhkan konfirmasi manual. Silakan periksa item
                  dengan akurasi di bawah 80%.
                </p>
                <div className="bg-white rounded-xl p-4 border border-yellow-200/30">
                  <h4 className="font-semibold text-gray-800 mb-2">🔍 Item yang perlu dikonfirmasi:</h4>
                  <div className="space-y-2">
                    {receiptItems
                      .filter((item) => (item.confidence || 0) < 80)
                      .map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                          <span className="text-gray-700">{item.name}</span>
                          <span className="text-yellow-600 font-medium">{item.confidence}% akurasi</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {receipt.status === "Pending" && (
              <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-2xl p-6 border border-blue-200/50">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span>⏳ Sedang Diproses</span>
                </h3>
                <p className="text-blue-700 mb-4">
                  Nota Anda sedang dalam antrian pemrosesan. Proses parsing biasanya memakan waktu 2-5 menit tergantung
                  kompleksitas nota.
                </p>
                <div className="bg-white rounded-xl p-4 border border-blue-200/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-gray-600">Memproses foto nota belanja...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Processing Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Informasi Pemrosesan</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID Nota:</span>
                    <span className="font-mono text-sm text-gray-800">#{receipt.id.toString().padStart(6, "0")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Waktu Proses:</span>
                    <span className="font-semibold text-gray-800">{receipt.processingTime || "2.3 detik"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Harga Terupdate:</span>
                    <span className={`font-semibold ${receipt.pricesUpdated ? "text-success-600" : "text-gray-600"}`}>
                      {receipt.pricesUpdated ? "Ya" : "Tidak"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Akurasi Rata-rata:</span>
                    <span className="font-semibold text-gray-800">
                      {receiptItems.length > 0
                        ? `${Math.round(receiptItems.reduce((sum, item) => sum + (item.confidence || 0), 0) / receiptItems.length)}%`
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">📝 Catatan</h3>
                <div className="space-y-3">
                  {receipt.notes ? (
                    <p className="text-gray-700">{receipt.notes}</p>
                  ) : (
                    <p className="text-gray-500 italic">Tidak ada catatan khusus</p>
                  )}
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Nota ini diproses menggunakan teknologi OCR (Optical Character Recognition) dengan tingkat akurasi
                      yang dapat bervariasi tergantung kualitas foto.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-100 p-6 bg-gray-50/50">
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-200"
            >
              Tutup
            </button>

            {receipt.status === "Gagal" && onReprocess && (
              <button
                onClick={() => onReprocess(receipt)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-blue-500/25"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Proses Ulang</span>
              </button>
            )}

            {receipt.status === "Butuh Konfirmasi" && onConfirmItems && (
              <button
                onClick={() => onConfirmItems(receipt)}
                className="px-6 py-3 bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 text-white rounded-2xl font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-success-500/25"
              >
                <Check className="w-5 h-5" />
                <span>Konfirmasi Item</span>
              </button>
            )}

            {receipt.status === "Parsed" && (
              <button className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-2xl font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-primary-500/25">
                <Download className="w-5 h-5" />
                <span>Export Data</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
