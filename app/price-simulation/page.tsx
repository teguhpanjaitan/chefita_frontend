"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calculator, RotateCcw, Save, TrendingUp, TrendingDown, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Sidebar from "@/components/sidebar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Mock data for recipes
const mockRecipes = [
  {
    id: "1",
    name: "Nasi Gudeg Jogja",
    ingredients: [
      { id: "1", name: "Nangka Muda", currentPrice: 8000, quantity: 0.5, unit: "kg" },
      { id: "2", name: "Santan Kelapa", currentPrice: 5000, quantity: 0.2, unit: "liter" },
      { id: "3", name: "Gula Merah", currentPrice: 12000, quantity: 0.1, unit: "kg" },
      { id: "4", name: "Bawang Merah", currentPrice: 25000, quantity: 0.05, unit: "kg" },
      { id: "5", name: "Kemiri", currentPrice: 45000, quantity: 0.02, unit: "kg" },
    ],
  },
  {
    id: "2",
    name: "Soto Ayam Lamongan",
    ingredients: [
      { id: "6", name: "Ayam Kampung", currentPrice: 35000, quantity: 0.3, unit: "kg" },
      { id: "7", name: "Mie Kuning", currentPrice: 8000, quantity: 0.1, unit: "kg" },
      { id: "8", name: "Tauge", currentPrice: 4000, quantity: 0.05, unit: "kg" },
      { id: "9", name: "Daun Bawang", currentPrice: 15000, quantity: 0.02, unit: "kg" },
      { id: "10", name: "Bawang Goreng", currentPrice: 80000, quantity: 0.01, unit: "kg" },
    ],
  },
  {
    id: "3",
    name: "Rendang Daging Sapi",
    ingredients: [
      { id: "11", name: "Daging Sapi", currentPrice: 120000, quantity: 0.25, unit: "kg" },
      { id: "12", name: "Santan Kental", currentPrice: 8000, quantity: 0.15, unit: "liter" },
      { id: "13", name: "Cabai Merah", currentPrice: 30000, quantity: 0.05, unit: "kg" },
      { id: "14", name: "Lengkuas", currentPrice: 20000, quantity: 0.02, unit: "kg" },
      { id: "15", name: "Serai", currentPrice: 12000, quantity: 0.02, unit: "kg" },
    ],
  },
]

interface SimulatedIngredient {
  id: string
  name: string
  currentPrice: number
  simulatedPrice: number
  quantity: number
  unit: string
  currentCost: number
  simulatedCost: number
  changePercent: number
  impact: number
}

export default function PriceSimulationPage() {
  const { toast } = useToast()
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>("")
  const [targetMargin, setTargetMargin] = useState<number>(30)
  const [simulatedIngredients, setSimulatedIngredients] = useState<SimulatedIngredient[]>([])
  const [currentHPP, setCurrentHPP] = useState<number>(0)
  const [simulatedHPP, setSimulatedHPP] = useState<number>(0)
  const [currentSellingPrice, setCurrentSellingPrice] = useState<number>(0)
  const [simulatedSellingPrice, setSimulatedSellingPrice] = useState<number>(0)
  const [currentMargin, setCurrentMargin] = useState<number>(0)
  const [simulatedMargin, setSimulatedMargin] = useState<number>(0)

  const selectedRecipe = mockRecipes.find((recipe) => recipe.id === selectedRecipeId)

  // Initialize simulation when recipe is selected
  useEffect(() => {
    if (selectedRecipe) {
      const ingredients = selectedRecipe.ingredients.map((ingredient) => {
        const currentCost = ingredient.currentPrice * ingredient.quantity
        return {
          id: ingredient.id,
          name: ingredient.name,
          currentPrice: ingredient.currentPrice,
          simulatedPrice: ingredient.currentPrice,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          currentCost,
          simulatedCost: currentCost,
          changePercent: 0,
          impact: 0,
        }
      })
      setSimulatedIngredients(ingredients)
    }
  }, [selectedRecipe])

  // Recalculate everything when ingredients or margin change
  useEffect(() => {
    if (simulatedIngredients.length > 0) {
      const currentTotal = simulatedIngredients.reduce((sum, ing) => sum + ing.currentCost, 0)
      const simulatedTotal = simulatedIngredients.reduce((sum, ing) => sum + ing.simulatedCost, 0)

      setCurrentHPP(currentTotal)
      setSimulatedHPP(simulatedTotal)

      // Calculate selling prices using formula: Selling Price = HPP / (1 - Margin/100)
      const currentPrice = currentTotal / (1 - targetMargin / 100)
      const simulatedPrice = simulatedTotal / (1 - targetMargin / 100)

      setCurrentSellingPrice(currentPrice)
      setSimulatedSellingPrice(simulatedPrice)

      // Calculate actual margins
      const actualCurrentMargin = ((currentPrice - currentTotal) / currentPrice) * 100
      const actualSimulatedMargin = ((simulatedPrice - simulatedTotal) / simulatedPrice) * 100

      setCurrentMargin(actualCurrentMargin)
      setSimulatedMargin(actualSimulatedMargin)

      // Update ingredients with change percentages and impact
      const updatedIngredients = simulatedIngredients.map((ingredient) => ({
        ...ingredient,
        changePercent: ((ingredient.simulatedPrice - ingredient.currentPrice) / ingredient.currentPrice) * 100,
        impact: ingredient.simulatedCost - ingredient.currentCost,
      }))

      if (JSON.stringify(updatedIngredients) !== JSON.stringify(simulatedIngredients)) {
        setSimulatedIngredients(updatedIngredients)
      }

      // Show toast when calculation is complete
      if (selectedRecipeId) {
        toast({
          title: "Simulasi berhasil dihitung",
          description: `HPP: ${formatCurrency(simulatedTotal)}, Margin: ${actualSimulatedMargin.toFixed(1)}%`,
        })
      }
    }
  }, [simulatedIngredients.map((ing) => ing.simulatedPrice).join(","), targetMargin, selectedRecipeId])

  const handleIngredientPriceChange = (ingredientId: string, newPrice: number) => {
    setSimulatedIngredients((prev) =>
      prev.map((ingredient) =>
        ingredient.id === ingredientId
          ? {
            ...ingredient,
            simulatedPrice: newPrice,
            simulatedCost: newPrice * ingredient.quantity,
          }
          : ingredient,
      ),
    )
  }

  const handleReset = () => {
    if (selectedRecipe) {
      const resetIngredients = selectedRecipe.ingredients.map((ingredient) => {
        const currentCost = ingredient.currentPrice * ingredient.quantity
        return {
          id: ingredient.id,
          name: ingredient.name,
          currentPrice: ingredient.currentPrice,
          simulatedPrice: ingredient.currentPrice,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          currentCost,
          simulatedCost: currentCost,
          changePercent: 0,
          impact: 0,
        }
      })
      setSimulatedIngredients(resetIngredients)
      toast({
        title: "Simulasi direset",
        description: "Semua harga kembali ke nilai awal",
      })
    }
  }

  const handleSaveDraft = () => {
    toast({
      title: "Draft simulasi disimpan",
      description: "Simulasi berhasil disimpan sebagai draft",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getMarginBadge = (margin: number) => {
    if (margin >= 30) {
      return <Badge className="bg-success-500 hover:bg-success-600">Baik ({margin.toFixed(1)}%)</Badge>
    } else if (margin >= 15) {
      return <Badge className="bg-warning-500 hover:bg-warning-600">Cukup ({margin.toFixed(1)}%)</Badge>
    } else {
      return <Badge className="bg-danger-500 hover:bg-danger-600">Rendah ({margin.toFixed(1)}%)</Badge>
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 font-poppins">
      <Sidebar />
      <div className="flex-1 space-y-6">
        {/* Modern Header with gradient */}
        <div className="relative bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100/50">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-50/30 to-transparent"></div>
          <div className="relative p-4 lg:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                  📦 Simulasi Harga Jual
                </h1>
                <p className="text-gray-600 text-base lg:text-lg">
                  Hitung harga jual ideal dan skenario &quot;bagaimana jika&quot; harga bahan berubah
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 lg:p-8 space-y-6 lg:space-y-8" style={{ marginTop: "0"}}>
          {/* Form Section - Enhanced Styling */}
          <div className="bg-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100/50">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <Calculator className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Parameter Simulasi</h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="recipe" className="text-sm font-semibold text-gray-700">
                    Pilih Resep
                  </Label>
                  <Select value={selectedRecipeId} onValueChange={setSelectedRecipeId}>
                    <SelectTrigger className="h-12 border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200">
                      <SelectValue placeholder="Pilih resep untuk simulasi" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-gray-200">
                      {mockRecipes.map((recipe) => (
                        <SelectItem key={recipe.id} value={recipe.id} className="rounded-xl">
                          {recipe.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="margin" className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                    <span>Target Margin (%)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-gray-400 hover:text-primary-500 transition-colors" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-900 text-white border-gray-700 rounded-xl">
                          <p>Formula: Harga Jual = HPP / (1 - Margin/100)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input
                    id="margin"
                    type="number"
                    value={targetMargin}
                    onChange={(e) => setTargetMargin(Number(e.target.value))}
                    min="0"
                    max="100"
                    className="h-12 border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {selectedRecipe && (
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700">Harga Jual Simulasi</Label>
                  <div className="p-6 bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-2xl border border-primary-200/50">
                    <div className="text-3xl font-bold text-primary-700 mb-2">
                      {formatCurrency(simulatedSellingPrice)}
                    </div>
                    <div className="text-sm text-primary-600 font-medium">
                      Berdasarkan HPP {formatCurrency(simulatedHPP)} dengan margin {targetMargin}%
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* HPP Breakdown Table */}
          {selectedRecipe && simulatedIngredients.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Breakdown HPP per Bahan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama Bahan</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Harga Saat Ini</TableHead>
                        <TableHead>Harga Simulasi</TableHead>
                        <TableHead>Perubahan</TableHead>
                        <TableHead>Biaya Saat Ini</TableHead>
                        <TableHead>Biaya Simulasi</TableHead>
                        <TableHead>Dampak</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {simulatedIngredients.map((ingredient) => (
                        <TableRow
                          key={ingredient.id}
                          className={ingredient.simulatedPrice !== ingredient.currentPrice ? "bg-yellow-50" : ""}
                        >
                          <TableCell className="font-medium">{ingredient.name}</TableCell>
                          <TableCell>
                            {ingredient.quantity} {ingredient.unit}
                          </TableCell>
                          <TableCell>{formatCurrency(ingredient.currentPrice)}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={ingredient.simulatedPrice}
                              onChange={(e) => handleIngredientPriceChange(ingredient.id, Number(e.target.value))}
                              className="w-32"
                              min="0"
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              {ingredient.changePercent > 0 ? (
                                <TrendingUp className="w-4 h-4 text-red-500" />
                              ) : ingredient.changePercent < 0 ? (
                                <TrendingDown className="w-4 h-4 text-green-500" />
                              ) : null}
                              <span
                                className={
                                  ingredient.changePercent > 0
                                    ? "text-red-600"
                                    : ingredient.changePercent < 0
                                      ? "text-green-600"
                                      : "text-gray-600"
                                }
                              >
                                {ingredient.changePercent > 0 ? "+" : ""}
                                {ingredient.changePercent.toFixed(1)}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{formatCurrency(ingredient.currentCost)}</TableCell>
                          <TableCell className="font-medium">{formatCurrency(ingredient.simulatedCost)}</TableCell>
                          <TableCell>
                            <span
                              className={
                                ingredient.impact > 0
                                  ? "text-red-600"
                                  : ingredient.impact < 0
                                    ? "text-green-600"
                                    : "text-gray-600"
                              }
                            >
                              {ingredient.impact > 0 ? "+" : ""}
                              {formatCurrency(ingredient.impact)}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Result Display - Enhanced Styling */}
          {selectedRecipe && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Condition Card */}
              <div className="bg-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100/50">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center">
                    <Calculator className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-700">Kondisi Saat Ini</h3>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                    <span className="text-gray-600 font-medium">Total HPP:</span>
                    <span className="font-bold text-lg text-gray-800">{formatCurrency(currentHPP)}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                    <span className="text-gray-600 font-medium">Harga Jual:</span>
                    <span className="font-bold text-lg text-gray-800">{formatCurrency(currentSellingPrice)}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                    <span className="text-gray-600 font-medium">Margin:</span>
                    {getMarginBadge(currentMargin)}
                  </div>
                </div>
              </div>

              {/* Simulation Result Card */}
              <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-sm border border-primary-200/50">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                    <Calculator className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-primary-700">Hasil Simulasi</h3>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 bg-white/70 rounded-2xl border border-primary-200/30">
                    <span className="text-primary-700 font-medium">Total HPP:</span>
                    <span className="font-bold text-lg text-primary-800">{formatCurrency(simulatedHPP)}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/70 rounded-2xl border border-primary-200/30">
                    <span className="text-primary-700 font-medium">Harga Jual:</span>
                    <span className="font-bold text-xl text-primary-800">{formatCurrency(simulatedSellingPrice)}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/70 rounded-2xl border border-primary-200/30">
                    <span className="text-primary-700 font-medium">Margin:</span>
                    {getMarginBadge(simulatedMargin)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons - Enhanced Styling */}
          {selectedRecipe && (
            <div className="flex flex-col sm:flex-row gap-4">
              {/* <button
                onClick={handleSaveDraft}
                className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 transform hover:-translate-y-0.5"
              >
                <Save className="w-5 h-5" />
                <span>Simpan sebagai Draft Simulasi</span>
              </button> */}
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex items-center space-x-2 bg-white border-gray-200 hover:bg-gray-50 rounded-2xl px-6 py-3 font-semibold transition-all duration-200 hover:shadow-md"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Simulasi</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
