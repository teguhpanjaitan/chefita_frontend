'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  ChefHat,
  DollarSign,
  FileText,
  TrendingUp,
  CreditCard,
  LogOut,
  ChevronDown,
  ChevronRight,
  List,
  Package,
  Tag,
  Send,
  Edit,
  Menu as MenuIcon,
  Calculator,
  Target,
  Sparkles,
  X
} from "lucide-react"

interface MenuItem {
  icon: any
  label: string
  href?: string
  children?: MenuItem[]
}

const menuItems: MenuItem[] = [
  {
    icon: BarChart3,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: ChefHat,
    label: "Resep & Bahan",
    children: [
      { icon: Package, label: "Daftar Bahan", href: "/ingredients" },
      { icon: List, label: "Daftar Resep", href: "/recipes" },
      { icon: Tag, label: "Kategori Resep", href: "/categories" },
    ],
  },
  {
    icon: DollarSign,
    label: "Harga Belanja",
    children: [
      { icon: Send, label: "Riwayat Nota Belanja", href: "/receipts" },
      { icon: Edit, label: "Update Harga Manual", href: "/price-update" },
    ],
  },
  {
    icon: MenuIcon,
    label: "Menu Jual",
    children: [
      { icon: List, label: "Daftar Menu Jual", href: "/menu-items" },
      { icon: Package, label: "Daftar Menu Paket", href: "/menu-packages" },
    ],
  },
  {
    icon: TrendingUp,
    label: "Simulasi & Margin",
    children: [
      { icon: Calculator, label: "Simulasi Harga Jual", href: "/price-simulation" },
      { icon: ChefHat, label: "Food Cost Simulator", href: "/food-cost" },
      { icon: Target, label: "Simulasi Modal & BEP", href: "/bep-simulation" },
    ],
  },
  {
    icon: CreditCard,
    label: "Token & Langganan",
    children: [
      { icon: CreditCard, label: "Token Saya", href: "/tokens" },
      { icon: TrendingUp, label: "Paket & Upgrade", href: "/plans" },
      { icon: FileText, label: "Riwayat Transaksi", href: "/transactions" },
    ],
  },
  {
    icon: LogOut,
    label: "Logout",
    href: "/logout",
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const getInitialExpandedItems = () => {
    const expanded = ["Dashboard"]
    menuItems.forEach((item) => {
      if (item.children?.some((child) => child.href === pathname)) {
        expanded.push(item.label)
      }
    })
    return expanded
  }

  const [expandedItems, setExpandedItems] = useState<string[]>(getInitialExpandedItems())

  useEffect(() => {
    setExpandedItems(getInitialExpandedItems())
    setSidebarOpen(false) // auto-close on route change (mobile UX)
  }, [pathname])

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    )
  }

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children?.length
    const isExpanded = expandedItems.includes(item.label)
    const isActive = item.href === pathname || item.children?.some((c) => c.href === pathname)
    const Icon = item.icon

    const MenuTag: any = item.href ? Link : 'div'
    const props = item.href ? { href: item.href } : {}

    return (
      <div key={item.label}>
        <MenuTag
          {...props}
          className={`group flex items-center justify-between px-4 py-3.5 rounded-2xl cursor-pointer transition-all duration-300
            ${level === 0
              ? isActive
                ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg transform scale-[1.02]"
                : "hover:bg-white/80 hover:shadow-md text-gray-700 hover:text-primary-600 backdrop-blur-sm"
              : "hover:bg-gray-50 text-gray-600 hover:text-gray-800 ml-6 rounded-xl"
            }`}
          onClick={() => hasChildren && toggleExpanded(item.label)}
        >
          <div className="flex items-center space-x-3">
            <Icon className={`${level > 0 ? "w-4 h-4" : "w-5 h-5"} ${isActive ? "text-primary-600" : ""}`} />
            <span className={`font-medium ${level > 0 ? "text-sm" : "text-base"} ${level > 0 && isActive ? "text-primary-600" : ""}`}>
              {item.label}
            </span>
          </div>
          {hasChildren && (
            isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )
          )}
        </MenuTag>

        {hasChildren && isExpanded && (
          <div className="mt-2 space-y-1 pl-2">{item.children.map((child) => renderMenuItem(child, level + 1))}</div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Hamburger (mobile) */}
      <div className="md:hidden p-4">
        <button onClick={() => setSidebarOpen(true)}>
          <MenuIcon className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:static z-50 top-0 left-0 h-full w-80 bg-gradient-to-b from-white to-gray-50/50 shadow-xl border-r border-gray-100/50 overflow-y-auto backdrop-blur-sm
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:block
      `}>
        {/* Close (mobile) */}
        <div className="md:hidden flex justify-end p-4">
          <button onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Header */}
        <div className="relative p-6 border-b border-gray-100/50">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-primary-100/50"></div>
          <div className="relative flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
              <ChefHat className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Chefita
              </h1>
              <div className="flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-primary-500" />
                <p className="text-sm text-gray-600 font-medium">F&B Management</p>
              </div>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="p-6 space-y-1">
          {menuItems.map((item) => renderMenuItem(item))}
        </nav>
      </div>
    </>
  )
}
