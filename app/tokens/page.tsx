"use client"

import Sidebar from "@/components/sidebar"
import { useState } from "react"
import {
    Search,
    Plus,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    CreditCard,
    AlertTriangle,
    TrendingUp,
    Crown,
    CheckCircle,
    Clock,
    Upload,
    RefreshCw,
    FileText,
    X,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TokenTransaction {
    id: number
    date: string
    activity: string
    tokensUsed: number
    description: string
    type: "usage" | "topup"
}

const mockTokenHistory: TokenTransaction[] = [
    {
        id: 1,
        date: "2024-06-30",
        activity: "Kirim Nota",
        tokensUsed: -5,
        description: "Parsing nota belanja Indomaret - 4 item",
        type: "usage",
    },
    {
        id: 2,
        date: "2024-06-30",
        activity: "Top-Up",
        tokensUsed: 500,
        description: "Pembelian paket 500 token",
        type: "topup",
    },
    {
        id: 3,
        date: "2024-06-29",
        activity: "Simulasi Harga",
        tokensUsed: -3,
        description: "Simulasi harga jual Paket Ayam Geprek",
        type: "usage",
    },
    {
        id: 4,
        date: "2024-06-29",
        activity: "Update Harga",
        tokensUsed: -2,
        description: "Update harga manual Gula Pasir",
        type: "usage",
    },
    {
        id: 5,
        date: "2024-06-28",
        activity: "Kirim Nota",
        tokensUsed: -8,
        description: "Parsing nota belanja Alfamart - 6 item",
        type: "usage",
    },
    {
        id: 6,
        date: "2024-06-28",
        activity: "Simulasi Harga",
        tokensUsed: -3,
        description: "Simulasi BEP Paket Sarapan",
        type: "usage",
    },
    {
        id: 7,
        date: "2024-06-27",
        activity: "Kirim Nota",
        tokensUsed: -4,
        description: "Parsing nota belanja Hypermart - 3 item",
        type: "usage",
    },
    {
        id: 8,
        date: "2024-06-26",
        activity: "Update Harga",
        tokensUsed: -2,
        description: "Update harga manual Ayam Fillet",
        type: "usage",
    },
]


const filterOptions = ["Semua", "Kirim Nota", "Simulasi", "Update Harga", "Top-Up"]
const tokenPackages = [
    { value: 100, label: "100 Token", price: "Rp 10.000" },
    { value: 500, label: "500 Token", price: "Rp 45.000" },
    { value: 1000, label: "1.000 Token", price: "Rp 85.000" },
    { value: 3000, label: "3.000 Token", price: "Rp 240.000" },
]

function ReceiptHistoryContent() {
    const { toast } = useToast()
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedFilter, setSelectedFilter] = useState("Semua")
    const [currentPage, setCurrentPage] = useState(1)
    const [showFilterDropdown, setShowFilterDropdown] = useState(false)
    const [selectedTokenPackage, setSelectedTokenPackage] = useState(tokenPackages[0])
    const [showTokenDropdown, setShowTokenDropdown] = useState(false)
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [transactions, setTransactions] = useState(mockTokenHistory)
    const itemsPerPage = 10

    // Mock data for token balance
    const tokenBalance = 1250
    const monthlyUsage = 85
    const currentPlan = "Bisnis"
    const paymentStatus = "Active"

    const filteredTransactions = transactions.filter((transaction) => {
        const matchesSearch =
            transaction.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.description.toLowerCase().includes(searchTerm.toLowerCase())

        if (selectedFilter === "Semua") {
            return matchesSearch
        } else if (selectedFilter === "Top-Up") {
            return matchesSearch && transaction.type === "topup"
        } else {
            return matchesSearch && transaction.activity === selectedFilter
        }
    })

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage)

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        })
    }

    const getActivityIcon = (activity: string, type: string) => {
        if (type === "topup") return <Plus className="w-4 h-4 text-success-600" />
        switch (activity) {
            case "Kirim Nota":
                return <Upload className="w-4 h-4 text-blue-600" />
            case "Simulasi Harga":
                return <RefreshCw className="w-4 h-4 text-purple-600" />
            case "Update Harga":
                return <FileText className="w-4 h-4 text-orange-600" />
            default:
                return <FileText className="w-4 h-4 text-gray-600" />
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Active":
                return (
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-success-100 text-success-700 border border-success-200 flex items-center space-x-1">
                        <CheckCircle className="w-4 h-4" />
                        <span>Aktif</span>
                    </span>
                )
            case "Expired":
                return (
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-danger-100 text-danger-700 border border-danger-200 flex items-center space-x-1">
                        <X className="w-4 h-4" />
                        <span>Kedaluwarsa</span>
                    </span>
                )
            case "Trial":
                return (
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-warning-100 text-warning-700 border border-warning-200 flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>Trial</span>
                    </span>
                )
            default:
                return (
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                        {status}
                    </span>
                )
        }
    }

    const handleTopUp = () => {
        // Add new top-up transaction
        const newTransaction: TokenTransaction = {
            id: Math.max(...transactions.map((t) => t.id)) + 1,
            date: new Date().toISOString().split("T")[0],
            activity: "Top-Up",
            tokensUsed: selectedTokenPackage.value,
            description: `Pembelian paket ${selectedTokenPackage.value} token`,
            type: "topup",
        }

        setTransactions((prev) => [newTransaction, ...prev])
        setShowPaymentModal(false)

        toast({
            title: "Token berhasil ditambahkan",
            description: `${selectedTokenPackage.value} token telah ditambahkan ke akun Anda`,
            variant: "success",
        })
    }

    const handlePaymentConfirm = () => {
        setShowPaymentModal(true)
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
                                💰 Token Saya
                            </h1>
                            <p className="text-gray-600 text-base lg:text-lg">Kelola token dan riwayat pemakaian Anda</p>
                        </div>
                        <div className="hidden md:flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Saldo Token</p>
                                <p className="text-xl lg:text-2xl font-bold text-gray-800">{tokenBalance.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 lg:p-8 space-y-6 lg:space-y-8">
                {/* Low Token Warning */}
                {tokenBalance < 200 && (
                    <div className="relative bg-gradient-to-r from-danger-50 to-danger-100/50 border border-danger-200 rounded-2xl lg:rounded-3xl p-4 overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-danger-200/20 rounded-full -translate-y-10 translate-x-10"></div>
                        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center space-x-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-danger-500 to-danger-600 rounded-2xl flex items-center justify-center shadow-lg shadow-danger-500/25">
                                    <AlertTriangle className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800 text-sm lg:text-base">Token hampir habis!</p>
                                    <p className="text-xs text-gray-600">Segera top-up untuk melanjutkan layanan tanpa gangguan</p>
                                </div>
                            </div>
                            <button
                                onClick={handlePaymentConfirm}
                                className="bg-gradient-to-r from-danger-500 to-danger-600 hover:from-danger-600 hover:to-danger-700 text-white px-4 py-2 rounded-2xl text-xs font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-danger-500/25 hover:shadow-xl hover:shadow-danger-500/30 transform hover:scale-105"
                            >
                                <span>Top-up Sekarang</span>
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Token Balance Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {/* Token Tersisa */}
                    <div className="group relative bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100/50 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/25">
                                    <CreditCard className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                                </div>
                                <div className="flex items-center text-primary-600">
                                    <span className="text-xs font-semibold">Tersisa</span>
                                </div>
                            </div>
                            <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">{tokenBalance.toLocaleString()}</h3>
                            <p className="text-sm text-gray-600 font-medium">Token</p>
                        </div>
                    </div>

                    {/* Estimasi Pemakaian */}
                    <div className="group relative bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100/50 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                                    <TrendingUp className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                                </div>
                                <div className="flex items-center text-blue-600">
                                    <TrendingUp className="w-4 h-4 mr-1" />
                                    <span className="text-xs font-semibold">+12%</span>
                                </div>
                            </div>
                            <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">{monthlyUsage}</h3>
                            <p className="text-sm text-gray-600 font-medium">Pemakaian Bulan Ini</p>
                        </div>
                    </div>

                    {/* Paket Langganan */}
                    <div className="group relative bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100/50 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-warning-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-warning-500 to-warning-600 rounded-2xl flex items-center justify-center shadow-lg shadow-warning-500/25">
                                    <Crown className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                                </div>
                                <div className="flex items-center text-warning-600">
                                    <span className="text-xs font-semibold">Aktif</span>
                                </div>
                            </div>
                            <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">{currentPlan}</h3>
                            <p className="text-sm text-gray-600 font-medium">Paket Langganan</p>
                        </div>
                    </div>

                    {/* Status Pembayaran */}
                    <div className="group relative bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100/50 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-success-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center shadow-lg shadow-success-500/25">
                                    <CheckCircle className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                                </div>
                            </div>
                            <div className="mb-2">{getStatusBadge(paymentStatus)}</div>
                            <p className="text-sm text-gray-600 font-medium">Status Pembayaran</p>
                        </div>
                    </div>
                </div>

                {/* Token Top-Up Section */}
                <div className="bg-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100/50">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-2">Top-Up Token</h3>
                            <p className="text-sm text-gray-600">Pilih paket token yang sesuai dengan kebutuhan Anda</p>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                        <div className="flex flex-col sm:flex-row gap-4 flex-1">
                            <div className="relative">
                                <button
                                    onClick={() => setShowTokenDropdown(!showTokenDropdown)}
                                    className="flex items-center justify-between w-full px-4 py-3 border border-gray-200 rounded-2xl bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                                >
                                    <div className="flex items-center space-x-3">
                                        <CreditCard className="w-5 h-5 text-gray-400" />
                                        <div className="text-left">
                                            <span className="text-gray-900 font-medium">{selectedTokenPackage.label}</span>
                                            <p className="text-sm text-gray-500">{selectedTokenPackage.price}</p>
                                        </div>
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                </button>

                                {showTokenDropdown && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-10">
                                        {tokenPackages.map((pkg) => (
                                            <button
                                                key={pkg.value}
                                                onClick={() => {
                                                    setSelectedTokenPackage(pkg)
                                                    setShowTokenDropdown(false)
                                                }}
                                                className="w-full text-left px-4 py-3 hover:bg-gray-50 first:rounded-t-2xl last:rounded-b-2xl transition-colors duration-200 flex items-center justify-between"
                                            >
                                                <div>
                                                    <span className="font-medium text-gray-900">{pkg.label}</span>
                                                    <p className="text-sm text-gray-500">{pkg.price}</p>
                                                </div>
                                                {selectedTokenPackage.value === pkg.value && (
                                                    <CheckCircle className="w-5 h-5 text-primary-500" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Harga mulai dari Rp10.000 per 100 token</p>
                        </div>

                        <button
                            onClick={handlePaymentConfirm}
                            className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 transform hover:scale-105 lg:w-auto w-full"
                        >
                            <CreditCard className="w-5 h-5" />
                            <span>Beli Token Sekarang</span>
                        </button>
                    </div>
                </div>

                {/* Token History Section */}
                <div className="bg-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100/50">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg lg:text-xl font-bold text-gray-800">Riwayat Pemakaian Token</h3>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between mb-6">
                        <div className="flex flex-col sm:flex-row gap-4 flex-1">
                            {/* Search Input */}
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Cari aktivitas..."
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
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden lg:block bg-white rounded-3xl shadow-sm border border-gray-100/50 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                                    <tr>
                                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Tanggal</th>
                                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Aktivitas</th>
                                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Token Terpakai</th>
                                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Keterangan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedTransactions.map((transaction, index) => (
                                        <tr
                                            key={transaction.id}
                                            className={`border-t border-gray-100 hover:bg-gray-50/50 transition-colors duration-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                                                }`}
                                        >
                                            <td className="py-4 px-6">
                                                <span className="text-gray-800 font-medium">{formatDate(transaction.date)}</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center space-x-3">
                                                    {getActivityIcon(transaction.activity, transaction.type)}
                                                    <span className="font-semibold text-gray-800">{transaction.activity}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span
                                                    className={`font-bold ${transaction.type === "topup" ? "text-success-600" : "text-gray-800"}`}
                                                >
                                                    {transaction.type === "topup" ? "+" : ""}
                                                    {Math.abs(transaction.tokensUsed).toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-gray-600">{transaction.description}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Cards */}
                    <div className="lg:hidden space-y-4">
                        {paginatedTransactions.map((transaction) => (
                            <div key={transaction.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center space-x-3">
                                        {getActivityIcon(transaction.activity, transaction.type)}
                                        <div>
                                            <h4 className="font-semibold text-gray-800">{transaction.activity}</h4>
                                            <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                                        </div>
                                    </div>
                                    <span className={`font-bold ${transaction.type === "topup" ? "text-success-600" : "text-gray-800"}`}>
                                        {transaction.type === "topup" ? "+" : ""}
                                        {Math.abs(transaction.tokensUsed).toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">{transaction.description}</p>
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

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center">
                                        <CreditCard className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">Konfirmasi Pembelian</h3>
                                        <p className="text-sm text-gray-600">Top-up token ke akun Anda</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowPaymentModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600">Paket Token:</span>
                                    <span className="font-semibold text-gray-800">{selectedTokenPackage.label}</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600">Harga:</span>
                                    <span className="font-semibold text-gray-800">{selectedTokenPackage.price}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-2 mt-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-800">Total:</span>
                                        <span className="font-bold text-primary-600 text-lg">{selectedTokenPackage.price}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowPaymentModal(false)}
                                    className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors duration-200"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleTopUp}
                                    className="flex-1 px-4 py-3 bg-primary-500 text-white rounded-2xl font-semibold hover:bg-primary-600 transition-colors duration-200"
                                >
                                    Bayar Sekarang
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}


export default function TokensPage() {
    return (
        <div className="flex h-screen bg-gray-50 font-poppins">
            <Sidebar />
            <ReceiptHistoryContent />
        </div>
    )
}
