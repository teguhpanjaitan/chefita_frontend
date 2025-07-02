"use client"
import Sidebar from "@/components/sidebar"
import { useState } from "react"
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  CreditCard,
  Calendar,
  FileText,
  Smartphone,
  Building2,
  CheckCircle,
  Clock,
  XCircle,
  MessageCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Transaction {
  id: number
  date: string
  type: "Top-up Token" | "Langganan" | "Upgrade"
  amount: number
  paymentMethod: "VA BCA" | "VA Mandiri" | "QRIS" | "Manual Transfer" | "GoPay" | "OVO"
  status: "Berhasil" | "Pending" | "Gagal"
  invoiceId: string
  description: string
}

const mockTransactions: Transaction[] = [
  {
    id: 1,
    date: "2024-06-30",
    type: "Top-up Token",
    amount: 45000,
    paymentMethod: "QRIS",
    status: "Berhasil",
    invoiceId: "INV-2024-001",
    description: "Pembelian 500 token",
  },
  {
    id: 2,
    date: "2024-06-28",
    type: "Langganan",
    amount: 99000,
    paymentMethod: "VA BCA",
    status: "Berhasil",
    invoiceId: "INV-2024-002",
    description: "Langganan Paket Bisnis - 1 bulan",
  },
  {
    id: 3,
    date: "2024-06-25",
    type: "Top-up Token",
    amount: 85000,
    paymentMethod: "GoPay",
    status: "Berhasil",
    invoiceId: "INV-2024-003",
    description: "Pembelian 1.000 token",
  },
  {
    id: 4,
    date: "2024-06-20",
    type: "Upgrade",
    amount: 50000,
    paymentMethod: "VA Mandiri",
    status: "Pending",
    invoiceId: "INV-2024-004",
    description: "Upgrade dari Pro ke Bisnis",
  },
  {
    id: 5,
    date: "2024-06-15",
    type: "Top-up Token",
    amount: 10000,
    paymentMethod: "Manual Transfer",
    status: "Gagal",
    invoiceId: "INV-2024-005",
    description: "Pembelian 100 token",
  },
  {
    id: 6,
    date: "2024-06-10",
    type: "Langganan",
    amount: 49000,
    paymentMethod: "OVO",
    status: "Berhasil",
    invoiceId: "INV-2024-006",
    description: "Langganan Paket Pro - 1 bulan",
  },
  {
    id: 7,
    date: "2024-06-05",
    type: "Top-up Token",
    amount: 240000,
    paymentMethod: "VA BCA",
    status: "Berhasil",
    invoiceId: "INV-2024-007",
    description: "Pembelian 3.000 token",
  },
  {
    id: 8,
    date: "2024-05-30",
    type: "Langganan",
    amount: 99000,
    paymentMethod: "QRIS",
    status: "Berhasil",
    invoiceId: "INV-2024-008",
    description: "Langganan Paket Bisnis - 1 bulan",
  },
]

const filterOptions = ["Semua", "Langganan", "Top-up Token", "Upgrade"]
const statusOptions = ["Semua Status", "Berhasil", "Pending", "Gagal"]

function TransactionsContent() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("Semua")
  const [selectedStatus, setSelectedStatus] = useState("Semua Status")
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Transaction | null>(null)
  const [showContactModal, setShowContactModal] = useState(false)
  const itemsPerPage = 10

  const filteredTransactions = mockTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = selectedFilter === "Semua" || transaction.type === selectedFilter
    const matchesStatus = selectedStatus === "Semua Status" || transaction.status === selectedStatus

    return matchesSearch && matchesFilter && matchesStatus
  })

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage)

  // Calculate total spent this month
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const monthlyTotal = mockTransactions
    .filter((t) => {
      const transactionDate = new Date(t.date)
      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear &&
        t.status === "Berhasil"
      )
    })
    .reduce((sum, t) => sum + t.amount, 0)

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Berhasil":
        return (
          <span className="px-3 py-1 rounded-full text-sm font-semibold bg-success-100 text-success-700 border border-success-200 flex items-center space-x-1">
            <CheckCircle className="w-4 h-4" />
            <span>Berhasil</span>
          </span>
        )
      case "Pending":
        return (
          <span className="px-3 py-1 rounded-full text-sm font-semibold bg-warning-100 text-warning-700 border border-warning-200 flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>Pending</span>
          </span>
        )
      case "Gagal":
        return (
          <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700 border border-red-200 flex items-center space-x-1">
            <XCircle className="w-4 h-4" />
            <span>Gagal</span>
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

  const getPaymentMethodIcon = (method: string) => {
    if (method.includes("VA") || method.includes("Transfer")) {
      return <Building2 className="w-4 h-4 text-blue-600" />
    } else if (method === "QRIS") {
      return <CreditCard className="w-4 h-4 text-purple-600" />
    } else {
      return <Smartphone className="w-4 h-4 text-green-600" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Top-up Token":
        return <CreditCard className="w-4 h-4 text-blue-600" />
      case "Langganan":
        return <Calendar className="w-4 h-4 text-green-600" />
      case "Upgrade":
        return <FileText className="w-4 h-4 text-purple-600" />
      default:
        return <FileText className="w-4 h-4 text-gray-600" />
    }
  }

  const handleDownloadInvoice = (transaction: Transaction) => {
    setSelectedInvoice(transaction)
    setShowInvoiceModal(true)
  }

  const handleInvoiceDownload = () => {
    toast({
      title: "Invoice berhasil diunduh",
      description: `Invoice ${selectedInvoice?.invoiceId} telah diunduh`,
      variant: "success",
    })
    setShowInvoiceModal(false)
  }

  const handleRequestManualInvoice = () => {
    setShowContactModal(true)
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
                📄 Riwayat Pembayaran
              </h1>
              <p className="text-gray-600 text-base lg:text-lg">
                Lihat semua transaksi pembayaran Anda untuk langganan dan token
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Bulan Ini</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-800">{formatCurrency(monthlyTotal)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-8 space-y-6 lg:space-y-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm border border-gray-100/50">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari transaksi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Type Filter */}
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

              {/* Status Filter */}
              <div className="relative">
                <button
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className="flex items-center justify-between w-full sm:w-48 px-4 py-3 border border-gray-200 rounded-2xl bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                >
                  <span className="text-gray-700">{selectedStatus}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {showStatusDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-10">
                    {statusOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSelectedStatus(option)
                          setShowStatusDropdown(false)
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

            {/* Manual Invoice Button */}
            <button
              onClick={handleRequestManualInvoice}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 lg:px-6 py-3 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transform hover:scale-105"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Minta Invoice Manual</span>
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100/50 overflow-hidden">
          <div className="p-4 lg:p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800">Daftar Transaksi</h3>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Tanggal</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Jenis Transaksi</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Jumlah</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Metode Pembayaran</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Invoice</th>
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
                        {getTypeIcon(transaction.type)}
                        <div>
                          <span className="font-semibold text-gray-800">{transaction.type}</span>
                          <p className="text-sm text-gray-500">{transaction.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-gray-800">{formatCurrency(transaction.amount)}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {getPaymentMethodIcon(transaction.paymentMethod)}
                        <span className="text-gray-700">{transaction.paymentMethod}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">{getStatusBadge(transaction.status)}</td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleDownloadInvoice(transaction)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors duration-200"
                        title="Download Invoice"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden p-4 space-y-4">
            {paginatedTransactions.map((transaction) => (
              <div key={transaction.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon(transaction.type)}
                    <div>
                      <h4 className="font-semibold text-gray-800">{transaction.type}</h4>
                      <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">{formatCurrency(transaction.amount)}</p>
                    <button
                      onClick={() => handleDownloadInvoice(transaction)}
                      className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1 mt-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Invoice</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Metode Pembayaran</p>
                    <div className="flex items-center space-x-2">
                      {getPaymentMethodIcon(transaction.paymentMethod)}
                      <span className="text-sm font-medium text-gray-700">{transaction.paymentMethod}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    {getStatusBadge(transaction.status)}
                  </div>
                </div>

                <p className="text-sm text-gray-600">{transaction.description}</p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 p-6 border-t border-gray-100">
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

      {/* Invoice Modal */}
      {showInvoiceModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Download Invoice</h3>
                    <p className="text-sm text-gray-600">{selectedInvoice.invoiceId}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                >
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Transaksi:</span>
                  <span className="font-semibold text-gray-800">{selectedInvoice.type}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Tanggal:</span>
                  <span className="font-semibold text-gray-800">{formatDate(selectedInvoice.date)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Jumlah:</span>
                  <span className="font-semibold text-gray-800">{formatCurrency(selectedInvoice.amount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  {getStatusBadge(selectedInvoice.status)}
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors duration-200"
                >
                  Batal
                </button>
                <button
                  onClick={handleInvoiceDownload}
                  className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-2xl font-semibold hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Minta Invoice Manual</h3>
                    <p className="text-sm text-gray-600">Hubungi tim support kami</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                >
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="bg-green-50 rounded-2xl p-4 mb-6">
                <p className="text-sm text-green-800 mb-3">
                  Tim support kami siap membantu Anda untuk menerbitkan invoice manual atau mengatasi masalah
                  pembayaran.
                </p>
                <p className="text-sm text-green-700 font-medium">
                  📱 WhatsApp: +62 812-3456-7890
                  <br />📧 Email: support@chefita.com
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowContactModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors duration-200"
                >
                  Tutup
                </button>
                <button
                  onClick={() => {
                    window.open("https://wa.me/6281234567890", "_blank")
                    setShowContactModal(false)
                  }}
                  className="flex-1 px-4 py-3 bg-green-500 text-white rounded-2xl font-semibold hover:bg-green-600 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function TransactionsPage() {
  return (
    <div className="flex h-screen bg-gray-50 font-poppins">
      <Sidebar />
      <TransactionsContent />
    </div>
  )
}
