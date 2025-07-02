"use client"

import { useState } from "react"
import {
  Search,
  ChevronDown,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Download,
  Save,
  Calculator,
  BarChart3,
} from "lucide-react"
import Sidebar from "../../components/sidebar"
import { useToast } from "@/hooks/use-toast"

interface IngredientComparison {
  id: number
  name: string
  currentPrice: number
  previousPrice: number
  priceChange: number
  percentageChange: number
  impactOnTotalHPP: number
  category: string
}

const mockComparisonData: IngredientComparison[] = [
  {
    id: 1,
    name: "Daging Ayam",
    currentPrice: 35000,
    previousPrice: 30000,
    priceChange: 5000,
    percentageChange: 16.7,
    impactOnTotalHPP: 8.5,
    category: "Protein",
  },
  {
    id: 2,
    name: "Minyak Goreng",
    currentPrice: 18000,
    previousPrice: 15000,
    priceChange: 3000,
    percentageChange: 20.0,
    impactOnTotalHPP: 12.3,
    category: "Minyak & Lemak",
  },
  {
    id: 3,
    name: "Beras",
    currentPrice: 12000,
    previousPrice: 11500,
    priceChange: 500,
    percentageChange: 4.3,
    impactOnTotalHPP: 2.1,
    category: "Karbohidrat",
  },
  {
    id: 4,
    name: "Cabai Merah",
    currentPrice: 45000,
    previousPrice: 35000,
    priceChange: 10000,
    percentageChange: 28.6,
    impactOnTotalHPP: 15.2,
    category: "Bumbu",
  },
  {
    id: 5,
    name: "Bawang Merah",
    currentPrice: 25000,
    previousPrice: 22000,
    priceChange: 3000,
    percentageChange: 13.6,
    impactOnTotalHPP: 5.8,
    category: "Bumbu",
  },
  {
    id: 6,
    name: "Telur Ayam",
    currentPrice: 28000,
    previousPrice: 26000,
    priceChange: 2000,
    percentageChange: 7.7,
    impactOnTotalHPP: 3.4,
    category: "Protein",
  },
]

const monthOptions = [
  "Januari 2024",
  "Februari 2024",
  "Maret 2024",
  "April 2024",
  "Mei 2024",
  "Juni 2024",
  "Juli 2024",
  "Agustus 2024",
  "September 2024",
  "Oktober 2024",
  "November 2024",
  "Desember 2024",
]

const recipeOptions = ["Semua Resep", "Ayam Geprek", "Nasi Goreng", "Mie Ayam", "Roti Bakar"]

const sortOptions = ["Nama Bahan", "Perubahan (%)", "Impact ke HPP"]

const hppTrendData = [
  { month: "Jun", hpp: 45000 },
  { month: "Jul", hpp: 47000 },
  { month: "Aug", hpp: 48500 },
  { month: "Sep", hpp: 52000 },
  { month: "Oct", hpp: 54000 },
  { month: "Nov", hpp: 58000 },
]

const topInflationData = [
  { ingredient: "Cabai Merah", percentage: 28.6 },
  { ingredient: "Minyak Goreng", percentage: 20.0 },
  { ingredient: "Daging Ayam", percentage: 16.7 },
  { ingredient: "Bawang Merah", percentage: 13.6 },
  { ingredient: "Telur Ayam", percentage: 7.7 },
]

function FoodCostSimulatorContent() {
  const { toast } = useToast()
  const [currentMonth, setCurrentMonth] = useState("November 2024")
  const [comparisonMonth, setComparisonMonth] = useState("Oktober 2024")
  const [selectedRecipe, setSelectedRecipe] = useState("Semua Resep")
  const [sortBy, setSortBy] = useState("Impact ke HPP")
  const [searchTerm, setSearchTerm] = useState("")
  const [showCurrentMonthDropdown, setShowCurrentMonthDropdown] = useState(false)
  const [showComparisonMonthDropdown, setShowComparisonMonthDropdown] = useState(false)
  const [showRecipeDropdown, setShowRecipeDropdown] = useState(false)
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [comparisonData, setComparisonData] = useState<IngredientComparison[]>([])
  const [hasCompared, setHasCompared] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleCompare = () => {
    setComparisonData(mockComparisonData)
    setHasCompared(true)
    toast({
      title: "Perbandingan berhasil",
      description: `Data HPP ${currentMonth} vs ${comparisonMonth} telah dimuat`,
      variant: "success",
    })
  }

  const handleSaveSnapshot = () => {
    toast({
      title: "Snapshot tersimpan",
      description: "Laporan simulasi telah disimpan ke arsip",
      variant: "success",
    })
  }

  const handleExport = () => {
    toast({
      title: "Export berhasil",
      description: "Data perbandingan telah diunduh sebagai CSV",
      variant: "success",
    })
  }

  const filteredData = comparisonData.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case "Nama Bahan":
        return a.name.localeCompare(b.name)
      case "Perubahan (%)":
        return b.percentageChange - a.percentageChange
      case "Impact ke HPP":
        return b.impactOnTotalHPP - a.impactOnTotalHPP
      default:
        return 0
    }
  })

  // Calculate summary metrics
  const currentTotalHPP = 58000
  const previousTotalHPP = 54000
  const hppDifference = currentTotalHPP - previousTotalHPP
  const hppPercentageChange = (hppDifference / previousTotalHPP) * 100
  const mostImpactfulIngredient = comparisonData.reduce(
    (max, item) => (item.impactOnTotalHPP > max.impactOnTotalHPP ? item : max),
    comparisonData[0] || { name: "-", impactOnTotalHPP: 0 },
  )

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-50 overflow-y-auto">
      {/* Modern Header with gradient */}
      <div className="relative bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100/50">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-50/30 to-transparent"></div>
        <div className="relative p-4 lg:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                📊 Food Cost Simulator
              </h1>
              <p className="text-gray-600 text-base lg:text-lg">
                Bandingkan HPP antar bulan dan identifikasi kontributor inflasi
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Status</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-800">
                  {hasCompared ? "Siap" : "Belum Dibandingkan"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-8 space-y-6 lg:space-y-8">
        {/* Filter Controls */}
        <div className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm border border-gray-100/50">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-end lg:justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
              {/* Current Month */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bulan Sekarang</label>
                <div className="relative">
                  <button
                    onClick={() => setShowCurrentMonthDropdown(!showCurrentMonthDropdown)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 flex items-center justify-between"
                  >
                    <span className="text-gray-700">{currentMonth}</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {showCurrentMonthDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-20 max-h-48 overflow-y-auto">
                      {monthOptions.map((month) => (
                        <button
                          key={month}
                          onClick={() => {
                            setCurrentMonth(month)
                            setShowCurrentMonthDropdown(false)
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 first:rounded-t-2xl last:rounded-b-2xl transition-colors duration-200"
                        >
                          {month}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Comparison Month */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bulan Perbandingan</label>
                <div className="relative">
                  <button
                    onClick={() => setShowComparisonMonthDropdown(!showComparisonMonthDropdown)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 flex items-center justify-between"
                  >
                    <span className="text-gray-700">{comparisonMonth}</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {showComparisonMonthDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-20 max-h-48 overflow-y-auto">
                      {monthOptions.map((month) => (
                        <button
                          key={month}
                          onClick={() => {
                            setComparisonMonth(month)
                            setShowComparisonMonthDropdown(false)
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 first:rounded-t-2xl last:rounded-b-2xl transition-colors duration-200"
                        >
                          {month}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Recipe Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Filter Resep (Opsional)</label>
                <div className="relative">
                  <button
                    onClick={() => setShowRecipeDropdown(!showRecipeDropdown)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 flex items-center justify-between"
                  >
                    <span className="text-gray-700">{selectedRecipe}</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {showRecipeDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-20">
                      {recipeOptions.map((recipe) => (
                        <button
                          key={recipe}
                          onClick={() => {
                            setSelectedRecipe(recipe)
                            setShowRecipeDropdown(false)
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 first:rounded-t-2xl last:rounded-b-2xl transition-colors duration-200"
                        >
                          {recipe}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Compare Button */}
            <button
              onClick={handleCompare}
              className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 transform hover:scale-105"
            >
              <Calculator className="w-5 h-5" />
              <span>Bandingkan Sekarang</span>
            </button>
          </div>
        </div>

        {hasCompared && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {/* HPP Bulan Ini */}
              <div className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm border border-gray-100/50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-600">HPP Bulan Ini</h3>
                  <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <p className="text-2xl lg:text-3xl font-bold text-gray-800">{formatCurrency(currentTotalHPP)}</p>
                <p className="text-xs text-gray-500 mt-1">{currentMonth}</p>
              </div>

              {/* HPP Bulan Lalu */}
              <div className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm border border-gray-100/50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-600">HPP Bulan Lalu</h3>
                  <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
                <p className="text-2xl lg:text-3xl font-bold text-gray-800">{formatCurrency(previousTotalHPP)}</p>
                <p className="text-xs text-gray-500 mt-1">{comparisonMonth}</p>
              </div>

              {/* Selisih */}
              <div className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm border border-gray-100/50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-600">Selisih (%)</h3>
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      hppPercentageChange > 0 ? "bg-red-100" : "bg-green-100"
                    }`}
                  >
                    {hppPercentageChange > 0 ? (
                      <ArrowUp className="w-4 h-4 text-red-600" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <p
                    className={`text-2xl lg:text-3xl font-bold ${
                      hppPercentageChange > 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {hppPercentageChange > 0 ? "+" : ""}
                    {hppPercentageChange.toFixed(1)}%
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">{formatCurrency(Math.abs(hppDifference))}</p>
              </div>

              {/* Bahan Paling Berpengaruh */}
              <div className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm border border-gray-100/50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-600">Paling Berpengaruh</h3>
                  <div className="w-8 h-8 bg-warning-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-warning-600" />
                  </div>
                </div>
                <p className="text-lg lg:text-xl font-bold text-gray-800">{mostImpactfulIngredient.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Impact: {mostImpactfulIngredient.impactOnTotalHPP.toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* HPP Trend Chart */}
              <div className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm border border-gray-100/50">
                <h3 className="text-lg font-bold text-gray-800 mb-4">📈 Tren HPP (6 Bulan Terakhir)</h3>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {hppTrendData.map((data, index) => (
                    <div key={data.month} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-lg mb-2 transition-all duration-300 hover:from-primary-600 hover:to-primary-500"
                        style={{ height: `${(data.hpp / 60000) * 200}px` }}
                      ></div>
                      <span className="text-xs text-gray-600 font-medium">{data.month}</span>
                      <span className="text-xs text-gray-500">{formatCurrency(data.hpp)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Inflation Contributors */}
              <div className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm border border-gray-100/50">
                <h3 className="text-lg font-bold text-gray-800 mb-4">🔥 Top 5 Kenaikan Harga</h3>
                <div className="space-y-3">
                  {topInflationData.map((data, index) => (
                    <div key={data.ingredient} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                            index === 0
                              ? "bg-red-500"
                              : index === 1
                                ? "bg-orange-500"
                                : index === 2
                                  ? "bg-yellow-500"
                                  : "bg-gray-400"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <span className="font-medium text-gray-800">{data.ingredient}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div
                          className="h-2 bg-gradient-to-r from-red-400 to-red-500 rounded-full"
                          style={{ width: `${(data.percentage / 30) * 60}px` }}
                        ></div>
                        <span className="text-sm font-semibold text-red-600">+{data.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="bg-white rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100/50 overflow-hidden">
              {/* Table Header Controls */}
              <div className="p-4 lg:p-6 border-b border-gray-100">
                <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                  <h3 className="text-lg font-bold text-gray-800">📋 Detail Perbandingan Bahan</h3>

                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Cari bahan..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                      />
                    </div>

                    {/* Sort */}
                    <div className="relative">
                      <button
                        onClick={() => setShowSortDropdown(!showSortDropdown)}
                        className="flex items-center justify-between px-4 py-2 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 min-w-[140px]"
                      >
                        <span className="text-sm text-gray-700">Urutkan: {sortBy}</span>
                        <ChevronDown className="w-4 h-4 text-gray-400 ml-2" />
                      </button>

                      {showSortDropdown && (
                        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 min-w-[160px]">
                          {sortOptions.map((option) => (
                            <button
                              key={option}
                              onClick={() => {
                                setSortBy(option)
                                setShowSortDropdown(false)
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl transition-colors duration-200 text-sm"
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Export Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={handleExport}
                        className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
                      >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Export</span>
                      </button>
                      <button
                        onClick={handleSaveSnapshot}
                        className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center space-x-2"
                      >
                        <Save className="w-4 h-4" />
                        <span className="hidden sm:inline">Simpan</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Bahan</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Harga Bulan Ini</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Harga Bulan Lalu</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Selisih Harga</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Perubahan (%)</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">
                        <div className="flex items-center space-x-1">
                          <span>Impact ke Total HPP</span>
                          <div className="group relative">
                            <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center cursor-help">
                              <span className="text-xs text-white font-bold">?</span>
                            </div>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                              Kontribusi bahan ini terhadap kenaikan total HPP
                            </div>
                          </div>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedData.map((item, index) => (
                      <tr
                        key={item.id}
                        className={`border-t border-gray-100 hover:bg-gray-50/50 transition-colors duration-200 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                        } ${item.percentageChange >= 15 ? "bg-red-50/50 border-l-4 border-l-red-400" : ""}`}
                      >
                        <td className="py-4 px-6">
                          <div>
                            <div className="font-semibold text-gray-800">{item.name}</div>
                            <div className="text-xs text-gray-500">{item.category}</div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-semibold text-gray-800">{formatCurrency(item.currentPrice)}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-semibold text-gray-600">{formatCurrency(item.previousPrice)}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`font-semibold ${item.priceChange > 0 ? "text-red-600" : "text-green-600"}`}>
                            {item.priceChange > 0 ? "+" : ""}
                            {formatCurrency(item.priceChange)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            {item.percentageChange > 0 ? (
                              <ArrowUp className="w-4 h-4 text-red-500" />
                            ) : (
                              <ArrowDown className="w-4 h-4 text-green-500" />
                            )}
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                item.percentageChange >= 15
                                  ? "bg-red-100 text-red-700 border border-red-200"
                                  : item.percentageChange > 0
                                    ? "bg-orange-100 text-orange-700 border border-orange-200"
                                    : "bg-green-100 text-green-700 border border-green-200"
                              }`}
                            >
                              {item.percentageChange > 0 ? "+" : ""}
                              {item.percentageChange.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-semibold text-gray-800">{item.impactOnTotalHPP.toFixed(1)}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden p-4 space-y-4">
                {sortedData.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-2xl p-4 border ${
                      item.percentageChange >= 15
                        ? "bg-red-50 border-red-200 border-l-4 border-l-red-400"
                        : "bg-white border-gray-100"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-gray-800">{item.name}</h4>
                        <p className="text-xs text-gray-500">{item.category}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {item.percentageChange > 0 ? (
                          <ArrowUp className="w-4 h-4 text-red-500" />
                        ) : (
                          <ArrowDown className="w-4 h-4 text-green-500" />
                        )}
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            item.percentageChange >= 15
                              ? "bg-red-100 text-red-700"
                              : item.percentageChange > 0
                                ? "bg-orange-100 text-orange-700"
                                : "bg-green-100 text-green-700"
                          }`}
                        >
                          {item.percentageChange > 0 ? "+" : ""}
                          {item.percentageChange.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">Harga Sekarang</p>
                        <p className="font-semibold text-gray-800">{formatCurrency(item.currentPrice)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Harga Lalu</p>
                        <p className="font-semibold text-gray-600">{formatCurrency(item.previousPrice)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Selisih</p>
                        <p className={`font-semibold ${item.priceChange > 0 ? "text-red-600" : "text-green-600"}`}>
                          {item.priceChange > 0 ? "+" : ""}
                          {formatCurrency(item.priceChange)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Impact HPP</p>
                        <p className="font-semibold text-gray-800">{item.impactOnTotalHPP.toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {!hasCompared && (
          <div className="bg-white rounded-2xl lg:rounded-3xl p-8 lg:p-12 shadow-sm border border-gray-100/50 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calculator className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Perbandingan</h3>
            <p className="text-gray-600 mb-6">
              Pilih bulan yang ingin dibandingkan dan klik "Bandingkan Sekarang" untuk melihat analisis HPP
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-2xl p-4 border border-blue-200/50">
              <h4 className="font-semibold text-blue-800 mb-2">💡 Tips Penggunaan:</h4>
              <ul className="text-sm text-blue-700 space-y-1 text-left max-w-md mx-auto">
                <li>• Bandingkan bulan berturut-turut untuk melihat tren inflasi</li>
                <li>• Filter berdasarkan resep tertentu untuk analisis yang lebih spesifik</li>
                <li>• Perhatikan bahan dengan kenaikan ≥15% (ditandai merah)</li>
                <li>• Gunakan fitur export untuk laporan ke manajemen</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function FoodCostSimulatorPage() {
  return (
      <div className="flex h-screen bg-gray-50 font-poppins">
        <Sidebar />
        <FoodCostSimulatorContent />
      </div>
    )
}
