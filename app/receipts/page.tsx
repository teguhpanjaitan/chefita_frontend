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
} from "lucide-react"
import Sidebar from "../../components/sidebar"

interface ReceiptRecord {
    id: number
    dateSent: string
    totalItems: number
    parsingStatus: "success" | "warning" | "error"
    priceUpdated: boolean
    imageUrl?: string
    parsedItems?: Array<{
        name: string
        price: number
        updated: boolean
    }>
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

function ReceiptsContent() {
    const [receipts] = useState(mockReceipts)
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [selectedReceipt, setSelectedReceipt] = useState<ReceiptRecord | null>(null)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

    const whatsappNumber = "+62812-3456-7890"
    const whatsappMessage = encodeURIComponent(
        "Halo Chefita! Saya ingin mengirim foto nota belanja untuk update harga bahan. Terima kasih!",
    )
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${whatsappMessage}`

    const filteredReceipts = receipts.filter((receipt) => {
        if (statusFilter === "all") return true
        if (statusFilter === "success") return receipt.parsingStatus === "success"
        if (statusFilter === "warning") return receipt.parsingStatus === "warning"
        if (statusFilter === "error") return receipt.parsingStatus === "error"
        return true
    })

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "success":
                return (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center space-x-1">
                        <CheckCircle className="w-4 h-4" />
                        <span>✅ Sukses</span>
                    </span>
                )
            case "warning":
                return (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium flex items-center space-x-1">
                        <AlertTriangle className="w-4 h-4" />
                        <span>⚠️ Perlu Verifikasi</span>
                    </span>
                )
            case "error":
                return (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium flex items-center space-x-1">
                        <XCircle className="w-4 h-4" />
                        <span>❌ Gagal</span>
                    </span>
                )
            default:
                return null
        }
    }

    const handleViewDetail = (receipt: ReceiptRecord) => {
        setSelectedReceipt(receipt)
        setIsDetailModalOpen(true)
    }

    return (
        <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-50 overflow-y-auto">
            {/* Header */}
            <div className="relative bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100/50">
                <div className="absolute inset-0 bg-gradient-to-r from-green-50/30 to-transparent"></div>
                <div className="relative p-4 lg:p-8">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                            📲 Kirim & Riwayat Nota Belanja
                        </h1>
                        <p className="text-gray-600 text-base lg:text-lg">
                            Kirim foto nota belanja via WhatsApp untuk update harga otomatis
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-4 lg:p-8 space-y-8">
                {/* WhatsApp Section */}
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-3xl p-6 lg:p-8 border border-green-200">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-6 lg:space-y-0">
                        <div className="flex-1">
                            <h2 className="text-xl lg:text-2xl font-bold text-green-800 mb-3 flex items-center space-x-2">
                                <MessageCircle className="w-6 h-6" />
                                <span>Kirim Nota via WhatsApp</span>
                            </h2>
                            <p className="text-green-700 mb-4 text-base lg:text-lg">
                                Kirim foto nota belanja Anda ke WhatsApp Chefita, dan sistem akan otomatis memperbarui harga bahan Anda.
                            </p>
                            <div className="flex items-center space-x-4 text-green-600">
                                <div className="flex items-center space-x-2">
                                    <Phone className="w-4 h-4" />
                                    <span className="font-medium">{whatsappNumber}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0">
                            {/* WhatsApp Button */}
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-200 flex items-center space-x-3 shadow-lg shadow-green-600/25 hover:shadow-xl hover:shadow-green-600/30 transform hover:scale-105"
                            >
                                <MessageCircle className="w-5 h-5" />
                                <span>📲 Kirim via WhatsApp</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="flex items-center space-x-4">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                    <div className="px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
                        <Clock className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                        <div className="flex items-center space-x-4">
                            <Filter className="w-5 h-5 text-gray-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                                <option value="all">Semua Status</option>
                                <option value="success">Berhasil</option>
                                <option value="warning">Perlu Verifikasi</option>
                                <option value="error">Gagal</option>
                            </select>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>
                                Menampilkan {filteredReceipts.length} dari {receipts.length} nota
                            </span>
                        </div>
                    </div>
                </div>

                {/* Receipts Table */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100/50 overflow-hidden">
                    {/* Desktop Table */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                                <tr>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Tanggal Kirim</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Total Item</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Status Parsing</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Diupdate ke Harga?</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReceipts.map((receipt, index) => (
                                    <tr
                                        key={receipt.id}
                                        className={`border-t border-gray-100 hover:bg-gray-50/50 transition-colors duration-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                                            }`}
                                    >
                                        <td className="py-4 px-6">
                                            <div className="font-medium text-gray-800">
                                                {new Date(receipt.dateSent).toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="font-semibold text-gray-800">{receipt.totalItems} bahan</span>
                                        </td>
                                        <td className="py-4 px-6">{getStatusBadge(receipt.parsingStatus)}</td>
                                        <td className="py-4 px-6">
                                            {receipt.priceUpdated ? (
                                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                                    ✅ Ya
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                                                    ❌ Tidak
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6">
                                            <button
                                                onClick={() => handleViewDetail(receipt)}
                                                className="px-4 py-2 bg-primary-50 text-primary-600 rounded-xl font-medium hover:bg-primary-100 transition-colors duration-200 flex items-center space-x-2"
                                            >
                                                <Eye className="w-4 h-4" />
                                                <span>🔍 Lihat Detail</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="lg:hidden space-y-4 p-4">
                        {filteredReceipts.map((receipt) => (
                            <div key={receipt.id} className="bg-gray-50 rounded-2xl p-4">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="font-bold text-gray-800 mb-1">
                                            {new Date(receipt.dateSent).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </div>
                                        <div className="text-sm text-gray-600">{receipt.totalItems} bahan</div>
                                    </div>
                                    {receipt.priceUpdated ? (
                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                            ✅ Updated
                                        </span>
                                    ) : (
                                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">❌ Belum</span>
                                    )}
                                </div>

                                <div className="mb-4">{getStatusBadge(receipt.parsingStatus)}</div>

                                <button
                                    onClick={() => handleViewDetail(receipt)}
                                    className="w-full bg-primary-50 text-primary-600 py-3 rounded-xl font-semibold hover:bg-primary-100 transition-colors duration-200 flex items-center justify-center space-x-2"
                                >
                                    <Eye className="w-4 h-4" />
                                    <span>🔍 Lihat Detail</span>
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredReceipts.length === 0 && (
                        <div className="p-12 text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <Receipt className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Belum ada nota</h3>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                Kirim foto nota belanja pertama Anda via WhatsApp untuk mulai menggunakan fitur ini.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            <ReceiptDetailModal
                receipt={selectedReceipt}
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
            />
        </div>
    )
}

export default function ReceiptsPage() {
    return (
        <div className="flex h-screen bg-gray-50 font-poppins">
            <Sidebar />
            <ReceiptsContent />
        </div>
    )
}
