"use client"
import { useState } from "react"
import {
  ChefHat,
  MenuSquare,
  Package,
  BookOpen,
  AlertTriangle,
  CreditCard,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Zap,
  Target,
  Send,
  Edit,
  Calculator,
  X,
  ShoppingCart
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Sidebar from "../../components/sidebar"

function DashboardContent() {
  const [showIngredientAlert, setShowIngredientAlert] = useState(true)
  const [showTokenAlert, setShowTokenAlert] = useState(true)

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-50 overflow-y-auto">
      {/* Modern Header with gradient */}
      <div className="relative bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100/50">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-50/30 to-transparent"></div>
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                Dashboard Usaha Kuliner Kamu
              </h1>
              <p className="text-gray-600 text-lg">
                Selamat datang kembali! Pantau performa bisnis kuliner Anda hari ini.
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Hari ini</p>
                <p className="text-2xl font-bold text-gray-800">Rabu, 30 Jun</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Alerts & Call-to-Actions - Moved to top */}
        <div className="space-y-4">
          {showIngredientAlert && (
            <div className="relative bg-gradient-to-r from-warning-50 to-warning-100/50 border border-warning-200 rounded-3xl p-4 overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-warning-200/20 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-warning-500 to-warning-600 rounded-2xl flex items-center justify-center shadow-lg shadow-warning-500/25">
                    <AlertTriangle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-base">3 bahan belum diupdate dalam 7+ hari</p>
                    <p className="text-xs text-gray-600">
                      Harga mungkin sudah tidak akurat dan mempengaruhi kalkulasi margin
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="bg-gradient-to-r from-warning-500 to-warning-600 hover:from-warning-600 hover:to-warning-700 text-white px-4 py-2 rounded-2xl text-xs font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-warning-500/25 hover:shadow-xl hover:shadow-warning-500/30 transform hover:scale-105">
                    <span>Update Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowIngredientAlert(false)}
                    className="w-6 h-6 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 hover:shadow-md"
                  >
                    <X className="w-3 h-3 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {showTokenAlert && (
            <div className="relative bg-gradient-to-r from-danger-50 to-danger-100/50 border border-danger-200 rounded-3xl p-4 overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-danger-200/20 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-danger-500 to-danger-600 rounded-2xl flex items-center justify-center shadow-lg shadow-danger-500/25">
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-base">Token tersisa di bawah 100</p>
                    <p className="text-xs text-gray-600">Segera top-up untuk melanjutkan layanan tanpa gangguan</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="bg-gradient-to-r from-danger-500 to-danger-600 hover:from-danger-600 hover:to-danger-700 text-white px-4 py-2 rounded-2xl text-xs font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-danger-500/25 hover:shadow-xl hover:shadow-danger-500/30 transform hover:scale-105">
                    <span>Top-up Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowTokenAlert(false)}
                    className="w-6 h-6 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 hover:shadow-md"
                  >
                    <X className="w-3 h-3 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Total Active Recipes - Enhanced */}
          <div className="group relative bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100/50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-success-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center shadow-lg shadow-success-500/25">
                  <ChefHat className="w-7 h-7 text-white" />
                </div>
                <div className="flex items-center text-success-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-xs font-semibold">+3 minggu ini</span>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">24</h3>
              <p className="text-sm text-gray-600 font-medium">Resep Aktif</p>
            </div>
          </div>

          {/* Total Active Menus - Enhanced */}
          <div className="group relative bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100/50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/25">
                  <MenuSquare className="w-7 h-7 text-white" />
                </div>
                <div className="flex items-center text-success-600">
                  <Target className="w-4 h-4 mr-1" />
                  <span className="text-xs font-semibold">42% avg</span>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">18</h3>
              <p className="text-sm text-gray-600 mb-1 font-medium">Menu Aktif</p>
              <p className="text-xs text-success-600 font-semibold">Rata-rata margin: 42%</p>
            </div>
          </div>

          {/* Ingredients Needing Update - Enhanced */}
          <div className="group relative bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100/50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-danger-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-danger-500 to-danger-600 rounded-2xl flex items-center justify-center shadow-lg shadow-danger-500/25">
                  <Package className="w-7 h-7 text-white" />
                </div>
                <span className="text-xs bg-danger-100 text-danger-700 px-3 py-1 rounded-full font-semibold">
                  Perlu Update
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">7</h3>
              <p className="text-sm text-gray-600 font-medium">Bahan &gt;7 hari</p>
            </div>
          </div>

          {/* Total Saved Simulations - Enhanced */}
          <div className="group relative bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100/50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <div className="flex items-center text-blue-600">
                  <Zap className="w-4 h-4 mr-1" />
                  <span className="text-xs font-semibold">Aktif</span>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">12</h3>
              <p className="text-sm text-gray-600 font-medium">Simulasi Tersimpan</p>
            </div>
          </div>
        </div>

        {/* Enhanced Margin Distribution */}
        <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Distribusi Margin Menu</h3>
            <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">Total: 12 menu</div>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-6 h-6 bg-gradient-to-r from-success-500 to-success-600 rounded-full shadow-sm"></div>
                <div>
                  <span className="text-sm font-semibold text-gray-700">Margin &gt;50%</span>
                  <p className="text-xs text-gray-500">Sangat menguntungkan</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-40 bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-success-500 to-success-600 h-3 rounded-full shadow-sm transition-all duration-500"
                    style={{ width: "50%" }}
                  ></div>
                </div>
                <span className="text-lg font-bold text-gray-800 min-w-[60px] text-right">6 menu</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-6 h-6 bg-gradient-to-r from-warning-500 to-warning-600 rounded-full shadow-sm"></div>
                <div>
                  <span className="text-sm font-semibold text-gray-700">Margin 30-50%</span>
                  <p className="text-xs text-gray-500">Cukup menguntungkan</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-40 bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-warning-500 to-warning-600 h-3 rounded-full shadow-sm transition-all duration-500"
                    style={{ width: "33%" }}
                  ></div>
                </div>
                <span className="text-lg font-bold text-gray-800 min-w-[60px] text-right">4 menu</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-6 h-6 bg-gradient-to-r from-danger-500 to-danger-600 rounded-full shadow-sm"></div>
                <div>
                  <span className="text-sm font-semibold text-gray-700">Margin &lt;30%</span>
                  <p className="text-xs text-gray-500">Perlu optimasi</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-40 bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-danger-500 to-danger-600 h-3 rounded-full shadow-sm transition-all duration-500"
                    style={{ width: "17%" }}
                  ></div>
                </div>
                <span className="text-lg font-bold text-gray-800 min-w-[60px] text-right">2 menu</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enhanced Top Ingredients */}
          <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Top Bahan Berdasarkan Kontribusi HPP</h3>
              <div className="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full">5 teratas</div>
            </div>
            <div className="space-y-4">
              {[
                { name: "Daging Sapi", recipes: 8, contribution: "Rp 45,000", trend: "up", percentage: 85 },
                { name: "Ayam Fillet", recipes: 12, contribution: "Rp 32,000", trend: "up", percentage: 65 },
                { name: "Keju Mozarella", recipes: 6, contribution: "Rp 28,500", trend: "down", percentage: 55 },
                { name: "Udang Besar", recipes: 4, contribution: "Rp 25,000", trend: "up", percentage: 45 },
                { name: "Salmon", recipes: 3, contribution: "Rp 22,000", trend: "up", percentage: 40 },
              ].map((ingredient, index) => (
                <div
                  key={index}
                  className="group flex items-center justify-between py-4 px-4 rounded-2xl hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-100"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-700">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">
                        {ingredient.name}
                      </p>
                      <div className="flex items-center space-x-2">
                        <p className="text-xs text-gray-500">{ingredient.recipes} resep</p>
                        <div className="flex items-center">
                          {ingredient.trend === "up" ? (
                            <TrendingUp className="w-3 h-3 text-success-500" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-danger-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800 text-lg">{ingredient.contribution}</p>
                    <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                      <div
                        className="bg-gradient-to-r from-primary-500 to-primary-600 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${ingredient.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Recent Activities */}
          <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Aktivitas Terbaru</h3>
              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">Lihat semua</button>
            </div>
            <div className="space-y-6">
              {[
                {
                  date: "30 Jun",
                  time: "14:30",
                  action: "Kirim nota belanja: Indomaret",
                  detail: "4 item berhasil diparsing",
                  type: "success",
                  icon: Send,
                },
                {
                  date: "29 Jun",
                  time: "09:15",
                  action: "Update harga: Gula Pasir",
                  detail: "Rp 12,000 → Rp 13,500",
                  type: "info",
                  icon: Edit,
                },
                {
                  date: "28 Jun",
                  time: "16:45",
                  action: "Simulasi BEP: Paket Sarapan",
                  detail: "Target 150 porsi/bulan",
                  type: "info",
                  icon: Calculator,
                },
                {
                  date: "27 Jun",
                  time: "11:20",
                  action: "Tambah resep baru: Nasi Goreng Spesial",
                  detail: "12 bahan, margin 45%",
                  type: "success",
                  icon: ChefHat,
                },
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-4 group">
                  <div className="flex-shrink-0 relative">
                    <div
                      className={`
                      w-10 h-10 rounded-xl flex items-center justify-center shadow-sm
                      ${activity.type === "success"
                          ? "bg-gradient-to-br from-success-100 to-success-200"
                          : "bg-gradient-to-br from-blue-100 to-blue-200"
                        }
                    `}
                    >
                      <activity.icon
                        className={`w-5 h-5 ${activity.type === "success" ? "text-success-600" : "text-blue-600"}`}
                      />
                    </div>
                    {index < 3 && (
                      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-px h-6 bg-gray-200"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">
                        {activity.action}
                      </p>
                      <div className="text-right">
                        <span className="text-xs text-gray-500 font-medium">{activity.date}</span>
                        <p className="text-xs text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 bg-gray-50 px-3 py-1 rounded-lg inline-block">
                      {activity.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="rounded-xl border-0 shadow-sm hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                <ChefHat className="h-6 w-6" />
                <span className="text-sm">Add Recipe</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                <Package className="h-6 w-6" />
                <span className="text-sm">Add Ingredient</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                <ShoppingCart className="h-6 w-6" />
                <span className="text-sm">Update Prices</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                <Target className="h-6 w-6" />
                <span className="text-sm">Cost Analysis</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ChefitaDashboard() {
  return (
    <div className="flex h-screen bg-gray-50 font-poppins">
      <Sidebar />
      <DashboardContent />
    </div>
  )
}
