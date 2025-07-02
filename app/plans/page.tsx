"use client"

import { useState } from "react"
import { Crown, Check, X, Calendar, CreditCard, Zap, TrendingUp, Star, MessageCircle, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useToast } from "@/hooks/use-toast"
import Sidebar from "@/components/sidebar"

interface Plan {
  id: string
  name: string
  price: string
  monthlyPrice: number
  yearlyPrice: number
  tokens: string
  popular?: boolean
  features: {
    name: string
    included: boolean
  }[]
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "Gratis",
    monthlyPrice: 0,
    yearlyPrice: 0,
    tokens: "100 Token/bulan",
    features: [
      { name: "Token Bulanan", included: true },
      { name: "Akses ke Bot WhatsApp", included: false },
      { name: "Simulasi Margin", included: false },
      { name: "Dashboard Analitik", included: false },
      { name: "Fitur Tambahan", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "Rp49.000/bulan",
    monthlyPrice: 49000,
    yearlyPrice: 490000,
    tokens: "1.000 Token/bulan",
    features: [
      { name: "Token Bulanan", included: true },
      { name: "Akses ke Bot WhatsApp", included: true },
      { name: "Simulasi Margin", included: true },
      { name: "Dashboard Analitik", included: false },
      { name: "Fitur Tambahan", included: false },
    ],
  },
  {
    id: "bisnis",
    name: "Bisnis",
    price: "Rp99.000/bulan",
    monthlyPrice: 99000,
    yearlyPrice: 990000,
    tokens: "3.000 Token/bulan",
    popular: true,
    features: [
      { name: "Token Bulanan", included: true },
      { name: "Akses ke Bot WhatsApp", included: true },
      { name: "Simulasi Margin", included: true },
      { name: "Dashboard Analitik", included: true },
      { name: "Fitur Tambahan", included: true },
    ],
  },
]

const faqItems = [
  {
    question: "Apa yang terjadi jika token habis?",
    answer:
      "Jika token habis, Anda masih bisa menggunakan fitur dasar aplikasi, namun fitur premium seperti analisis nota belanja dan simulasi harga akan terbatas. Anda bisa membeli token tambahan atau upgrade paket untuk mendapatkan lebih banyak token.",
  },
  {
    question: "Bisa upgrade ke paket tahunan?",
    answer:
      "Ya, semua paket tersedia dalam opsi bulanan dan tahunan. Paket tahunan memberikan diskon hingga 20% dibanding pembayaran bulanan. Anda bisa beralih ke paket tahunan kapan saja dari pengaturan akun.",
  },
  {
    question: "Apa kelebihan paket Bisnis?",
    answer:
      "Paket Bisnis memberikan akses penuh ke semua fitur Chefita termasuk dashboard analitik lanjutan, laporan detail, integrasi API, dan dukungan prioritas. Cocok untuk bisnis F&B yang membutuhkan analisis mendalam.",
  },
]

function PlansContent() {
  const [currentPlan] = useState("pro") // Simulate current plan
  const [isYearly, setIsYearly] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const { toast } = useToast()

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId)
    toast({
      title: "Paket dipilih!",
      description: `Anda akan dialihkan ke halaman pembayaran untuk paket ${plans.find((p) => p.id === planId)?.name}.`,
    })
  }

  const handleExtendPlan = () => {
    toast({
      title: "Perpanjang paket",
      description: "Anda akan dialihkan ke halaman pembayaran untuk memperpanjang paket aktif.",
    })
  }

  const currentPlanData = plans.find((p) => p.id === currentPlan)

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-50 overflow-y-auto">
      {/* Modern Header with gradient */}
      <div className="relative bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100/50">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-50/30 to-transparent"></div>
        <div className="relative p-4 lg:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                💰 Paket & Upgrade
              </h1>
              <p className="text-gray-600 text-base lg:text-lg">Kelola langganan dan upgrade paket Anda</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-8 space-y-6 lg:space-y-8">
        {/* Current Plan Section */}
        <Card className="border-0 shadow-lg shadow-gray-100/50 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-800">Paket Aktif Saya</CardTitle>
                  <p className="text-sm text-gray-600">Informasi langganan saat ini</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                <Check className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">Paket {currentPlanData?.name}</h3>
                  <p className="text-gray-600">Paket langganan aktif</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Zap className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Token bulanan</p>
                      <p className="font-semibold text-gray-800">{currentPlanData?.tokens}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Masa aktif</p>
                      <p className="font-semibold text-gray-800">s.d. 30 Juli 2025</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 flex items-center justify-end">
                <div className="space-y-3">
                  <Button
                    onClick={handleExtendPlan}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 rounded-xl shadow-lg shadow-green-500/25 transition-all duration-200 hover:scale-105"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Perpanjang Paket
                  </Button>
                  <p className="text-xs text-gray-500 text-center">Perpanjang sebelum masa aktif berakhir</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plan Comparison Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Bandingkan Paket Chefita</h2>
              <p className="text-gray-600">Pilih paket yang sesuai dengan kebutuhan bisnis Anda</p>
            </div>

            {/* Yearly/Monthly Toggle */}
            <div className="flex items-center space-x-3 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setIsYearly(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${!isYearly ? "bg-white text-gray-800 shadow-sm" : "text-gray-600 hover:text-gray-800"
                  }`}
              >
                Bulanan
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isYearly ? "bg-white text-gray-800 shadow-sm" : "text-gray-600 hover:text-gray-800"
                  }`}
              >
                Tahunan
                <Badge className="ml-2 bg-yellow-100 text-yellow-700 text-xs">Hemat 20%</Badge>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const isCurrentPlan = plan.id === currentPlan
              const displayPrice = isYearly ? `Rp${(plan.yearlyPrice / 1000).toFixed(0)}k/tahun` : plan.price

              return (
                <Card
                  key={plan.id}
                  className={`relative rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl ${plan.popular
                    ? "border-2 border-yellow-400 shadow-lg shadow-yellow-100"
                    : isCurrentPlan
                      ? "border-2 border-green-400 shadow-lg shadow-green-100"
                      : "border border-gray-200 shadow-sm hover:shadow-lg"
                    }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full shadow-lg">
                        <Star className="w-3 h-3 mr-1" />
                        Terpopuler
                      </Badge>
                    </div>
                  )}

                  {isCurrentPlan && (
                    <div className="absolute -top-3 right-4">
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full shadow-lg">
                        <Check className="w-3 h-3 mr-1" />
                        Aktif
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <div
                      className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 ${plan.popular
                        ? "bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/25"
                        : isCurrentPlan
                          ? "bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/25"
                          : "bg-gradient-to-br from-gray-400 to-gray-500 shadow-lg shadow-gray-500/25"
                        }`}
                    >
                      {plan.id === "free" && <Gift className="w-8 h-8 text-white" />}
                      {plan.id === "pro" && <TrendingUp className="w-8 h-8 text-white" />}
                      {plan.id === "bisnis" && <Crown className="w-8 h-8 text-white" />}
                    </div>

                    <CardTitle className="text-xl font-bold text-gray-800">{plan.name}</CardTitle>
                    <div className="space-y-1">
                      <p className="text-3xl font-bold text-gray-800">{displayPrice}</p>
                      {isYearly && plan.monthlyPrice > 0 && (
                        <p className="text-sm text-gray-500 line-through">
                          Rp{((plan.monthlyPrice * 12) / 1000).toFixed(0)}k/tahun
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 font-medium">{plan.tokens}</p>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center ${feature.included ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                              }`}
                          >
                            {feature.included ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          </div>
                          <span className={`text-sm ${feature.included ? "text-gray-800" : "text-gray-500"}`}>
                            {feature.name}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className={`w-full py-3 rounded-xl font-medium transition-all duration-200 ${isCurrentPlan
                            ? "bg-green-100 text-green-700 cursor-not-allowed hover:bg-green-100"
                            : plan.popular
                              ? "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-lg shadow-yellow-500/25 hover:scale-105"
                              : "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg shadow-primary-500/25 hover:scale-105"
                            }`}
                          disabled={isCurrentPlan}
                        >
                          {isCurrentPlan ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Paket Aktif
                            </>
                          ) : (
                            "Pilih Paket Ini"
                          )}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Konfirmasi Upgrade Paket</DialogTitle>
                          <DialogDescription>
                            Anda akan upgrade ke paket {plan.name} dengan harga {displayPrice}.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="bg-gray-50 rounded-xl p-4">
                            <h4 className="font-medium text-gray-800 mb-2">Detail Paket:</h4>
                            <ul className="space-y-1 text-sm text-gray-600">
                              <li>• {plan.tokens}</li>
                              <li>• Akses semua fitur sesuai paket</li>
                              <li>• Dukungan pelanggan 24/7</li>
                            </ul>
                          </div>
                          <div className="flex space-x-3">
                            <Button
                              onClick={() => handlePlanSelect(plan.id)}
                              className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white"
                            >
                              Lanjutkan Pembayaran
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="border-0 shadow-lg shadow-gray-100/50 rounded-2xl">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-gray-800">Catatan & FAQ</CardTitle>
                <p className="text-sm text-gray-600">Pertanyaan yang sering diajukan</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="space-y-4">
              {faqItems.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-gray-200 rounded-xl px-4 hover:border-primary-300 transition-colors duration-200"
                >
                  <AccordionTrigger className="text-left font-medium text-gray-800 hover:text-primary-600">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Support Contact */}
        <Card className="border-0 shadow-lg shadow-gray-100/50 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/25">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Butuh bantuan memilih paket?</h3>
                  <p className="text-sm text-gray-600">Tim kami siap membantu Anda menemukan paket yang tepat</p>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 rounded-xl shadow-lg shadow-green-500/25 transition-all duration-200 hover:scale-105">
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


export default function PlansPage() {
  return (
    <div className="flex h-screen bg-gray-50 font-poppins">
      <Sidebar />
      <PlansContent />
    </div>
  )
}
