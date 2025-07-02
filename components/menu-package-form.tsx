"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, Save, ArrowLeft, ChevronDown, Check } from "lucide-react"

interface MenuItem {
  id: number
  name: string
  sellingPrice: number
  totalHPP: number
  margin: number
}

interface MenuPackage {
  id?: number
  name: string
  menuItems: MenuItem[]
  totalHPP: number
  sellingPrice: number
  margin: number
}

interface MenuPackageFormProps {
  isOpen: boolean
  onClose: () => void
  menuPackage?: MenuPackage | null
  onSave: (menuPackage: MenuPackage) => void
}

// Mock available menu items
const mockMenuItems: MenuItem[] = [
  { id: 1, name: "Paket Ayam Geprek + Es Teh", sellingPrice: 15000, totalHPP: 7500, margin: 50 },
  { id: 2, name: "Nasi Goreng Special", sellingPrice: 12000, totalHPP: 5000, margin: 58.3 },
  { id: 3, name: "Paket Sarapan", sellingPrice: 8000, totalHPP: 5500, margin: 31.3 },
  { id: 4, name: "Mie Ayam Komplit", sellingPrice: 10000, totalHPP: 7000, margin: 30 },
  { id: 5, name: "Paket Hemat", sellingPrice: 11000, totalHPP: 9000, margin: 18.2 },
  { id: 6, name: "Soto Ayam Special", sellingPrice: 13000, totalHPP: 6500, margin: 50 },
  { id: 7, name: "Gado-gado Komplit", sellingPrice: 9000, totalHPP: 5500, margin: 38.9 },
  { id: 8, name: "Es Campur Spesial", sellingPrice: 7000, totalHPP: 3000, margin: 57.1 },
]

export default function MenuPackageForm({ isOpen, onClose, menuPackage, onSave }: MenuPackageFormProps) {
  const [formData, setFormData] = useState<MenuPackage>({
    name: "",
    menuItems: [],
    totalHPP: 0,
    sellingPrice: 0,
    margin: 0,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showMenuDropdown, setShowMenuDropdown] = useState(false)

  const isEditMode = !!menuPackage

  useEffect(() => {
    if (menuPackage) {
      setFormData(menuPackage)
    } else {
      setFormData({
        name: "",
        menuItems: [],
        totalHPP: 0,
        sellingPrice: 0,
        margin: 0,
      })
    }
    setErrors({})
  }, [menuPackage, isOpen])

  // Calculate totals when menu items or selling price changes
  useEffect(() => {
    const totalHPP = formData.menuItems.reduce((sum, menu) => sum + menu.totalHPP, 0)
    const margin = formData.sellingPrice > 0 ? ((formData.sellingPrice - totalHPP) / formData.sellingPrice) * 100 : 0

    setFormData((prev) => ({
      ...prev,
      totalHPP,
      margin,
    }))
  }, [formData.menuItems, formData.sellingPrice])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getMarginColor = (margin: number) => {
    if (margin >= 30) return "text-success-600 bg-success-50 border-success-200"
    if (margin >= 15) return "text-warning-600 bg-warning-50 border-warning-200"
    return "text-danger-600 bg-danger-50 border-danger-200"
  }

  const getMarginStatus = (margin: number) => {
    if (margin >= 30) return "Margin Bagus"
    if (margin >= 15) return "Margin Sedang"
    return "Margin Rendah"
  }

  const handleMenuToggle = (menu: MenuItem) => {
    setFormData((prev) => {
      const isSelected = prev.menuItems.some((m) => m.id === menu.id)
      if (isSelected) {
        return {
          ...prev,
          menuItems: prev.menuItems.filter((m) => m.id !== menu.id),
        }
      } else {
        return {
          ...prev,
          menuItems: [...prev.menuItems, menu],
        }
      }
    })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Nama paket harus diisi"
    }

    if (formData.menuItems.length === 0) {
      newErrors.menuItems = "Minimal harus memilih 1 menu"
    }

    if (formData.sellingPrice <= 0) {
      newErrors.sellingPrice = "Harga jual harus lebih dari 0"
    }

    if (formData.sellingPrice <= formData.totalHPP) {
      newErrors.sellingPrice = "Harga jual harus lebih tinggi dari total HPP"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSave(formData)
      onClose()
    }
  }

  const handlePriceChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "")
    const price = numericValue ? Number.parseInt(numericValue) : 0
    setFormData((prev) => ({ ...prev, sellingPrice: price }))
  }

  // Calculate potential savings for customers
  const originalTotalPrice = formData.menuItems.reduce((sum, menu) => sum + menu.sellingPrice, 0)
  const customerSavings = originalTotalPrice - formData.sellingPrice

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-primary-50 to-primary-100/50 p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
              <span>{isEditMode ? "✏️ Edit Menu Paket" : "➕ Tambah Menu Paket"}</span>
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-white/80 rounded-xl transition-colors duration-200">
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Package Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Paket <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 ${errors.name ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                placeholder="Masukkan nama paket bundling..."
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Select Menu Items */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pilih Menu Jual <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowMenuDropdown(!showMenuDropdown)}
                  className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 flex items-center justify-between ${errors.menuItems ? "border-red-300 bg-red-50" : "border-gray-200"
                    }`}
                >
                  <span className={formData.menuItems.length > 0 ? "text-gray-800" : "text-gray-400"}>
                    {formData.menuItems.length > 0
                      ? `${formData.menuItems.length} menu dipilih`
                      : "Pilih menu untuk paket ini"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {showMenuDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-20 max-h-64 overflow-y-auto">
                    {mockMenuItems.map((menu) => {
                      const isSelected = formData.menuItems.some((m) => m.id === menu.id)
                      return (
                        <button
                          key={menu.id}
                          type="button"
                          onClick={() => handleMenuToggle(menu)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 first:rounded-t-2xl last:rounded-b-2xl transition-colors duration-200 flex items-center justify-between"
                        >
                          <div>
                            <div className="font-medium text-gray-800">{menu.name}</div>
                            <div className="text-sm text-gray-500">
                              Harga: {formatCurrency(menu.sellingPrice)} • HPP: {formatCurrency(menu.totalHPP)} •
                              Margin: {menu.margin.toFixed(1)}%
                            </div>
                          </div>
                          {isSelected && <Check className="w-5 h-5 text-primary-600" />}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
              {errors.menuItems && <p className="text-red-500 text-sm mt-1">{errors.menuItems}</p>}

              {/* Selected Menu Items Display */}
              {formData.menuItems.length > 0 && (
                <div className="mt-4 space-y-3">
                  <p className="text-sm font-medium text-gray-700">Menu yang dipilih:</p>
                  <div className="space-y-2">
                    {formData.menuItems.map((menu) => (
                      <div
                        key={menu.id}
                        className="flex items-center justify-between p-3 bg-purple-50 rounded-xl border border-purple-200"
                      >
                        <div>
                          <div className="font-medium text-gray-800">{menu.name}</div>
                          <div className="text-sm text-gray-600">
                            Harga: {formatCurrency(menu.sellingPrice)} • HPP: {formatCurrency(menu.totalHPP)}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleMenuToggle(menu)}
                          className="p-1 hover:bg-purple-200 rounded-full transition-colors duration-200"
                        >
                          <X className="w-4 h-4 text-purple-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Selling Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Harga Jual Paket <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">Rp</span>
                <input
                  type="text"
                  value={formData.sellingPrice > 0 ? formData.sellingPrice.toLocaleString("id-ID") : ""}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 ${errors.sellingPrice ? "border-red-300 bg-red-50" : "border-gray-200"
                    }`}
                  placeholder="0"
                />
              </div>
              {errors.sellingPrice && <p className="text-red-500 text-sm mt-1">{errors.sellingPrice}</p>}
              {formData.sellingPrice > 0 && (
                <p className="text-sm text-gray-500 mt-1">Preview: {formatCurrency(formData.sellingPrice)}</p>
              )}
            </div>

            {/* Live Calculation Summary */}
            {formData.menuItems.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-3xl p-6 border border-blue-200/50">
                <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Perhitungan Paket</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <p className="text-sm text-gray-600 mb-1">Total HPP</p>
                    <p className="text-xl font-bold text-gray-800">{formatCurrency(formData.totalHPP)}</p>
                    <p className="text-xs text-gray-500 mt-1">dari {formData.menuItems.length} menu</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <p className="text-sm text-gray-600 mb-1">Harga Paket</p>
                    <p className="text-xl font-bold text-primary-600">
                      {formData.sellingPrice > 0 ? formatCurrency(formData.sellingPrice) : "Rp 0"}
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <p className="text-sm text-gray-600 mb-1">Margin Paket</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-xl font-bold text-gray-800">{formData.margin.toFixed(1)}%</p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold border ${getMarginColor(formData.margin)}`}
                      >
                        {getMarginStatus(formData.margin)}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <p className="text-sm text-gray-600 mb-1">Hemat Pelanggan</p>
                    <p className="text-xl font-bold text-success-600">
                      {customerSavings > 0 ? formatCurrency(customerSavings) : "Rp 0"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">vs beli terpisah</p>
                  </div>
                </div>

                {/* Price Comparison */}
                {originalTotalPrice > 0 && (
                  <div className="mt-4 p-4 bg-white rounded-2xl shadow-sm">
                    <h4 className="font-semibold text-gray-800 mb-2">💰 Perbandingan Harga</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Harga jika beli terpisah:</span>
                        <span className="font-semibold text-gray-800">{formatCurrency(originalTotalPrice)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Harga paket:</span>
                        <span className="font-semibold text-primary-600">{formatCurrency(formData.sellingPrice)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-success-600 font-semibold">Hemat pelanggan:</span>
                        <span className="font-bold text-success-600">{formatCurrency(customerSavings)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Margin Warning */}
                {formData.sellingPrice > 0 && formData.margin < 15 && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-700">
                      ⚠️ Margin terlalu rendah! Pertimbangkan untuk menaikkan harga paket atau memilih menu dengan HPP
                      lebih rendah.
                    </p>
                  </div>
                )}

                {/* Profit Calculation */}
                {formData.sellingPrice > formData.totalHPP && (
                  <div className="mt-4 p-3 bg-success-50 border border-success-200 rounded-xl">
                    <p className="text-sm text-success-700">
                      💰 Keuntungan per paket:{" "}
                      <strong>{formatCurrency(formData.sellingPrice - formData.totalHPP)}</strong>
                    </p>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-100 p-6 bg-gray-50/50">
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Batal</span>
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-primary-500/25"
            >
              <Save className="w-5 h-5" />
              <span>Simpan Paket</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
