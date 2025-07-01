"use client"

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
  HelpCircle,
  LogOut,
  ChevronDown,
  ChevronRight,
  List,
  Package,
  Upload,
  Tag,
  Send,
  Edit,
  MenuIcon,
  Calculator,
  Target,
  Sparkles,
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
      { icon: List, label: "Daftar Resep", href: "/recipes" },
      { icon: Package, label: "Daftar Bahan", href: "/ingredients" },
      { icon: Upload, label: "Import Excel", href: "/import" },
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
      { icon: Calculator, label: "Simulasi Harga Jual (dengan What-if)", href: "/price-simulation" },
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

  // Function to check if a menu item should be expanded based on current path
  const getInitialExpandedItems = () => {
    const expanded = ["Dashboard"] // Always keep Dashboard in the list

    menuItems.forEach((item) => {
      if (item.children) {
        // Check if any child matches the current pathname
        const hasActiveChild = item.children.some((child) => child.href === pathname)
        if (hasActiveChild) {
          expanded.push(item.label)
        }
      }
    })

    return expanded
  }

  const [expandedItems, setExpandedItems] = useState<string[]>(getInitialExpandedItems())

  // Add this useEffect after the useState declarations
  useEffect(() => {
    const newExpanded = getInitialExpandedItems()
    setExpandedItems(newExpanded)
  }, [pathname])

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) => (prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]))
  }

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.label)
    const Icon = item.icon
    const isActive =
      item.href === pathname ||
      (item.href === "/" && pathname === "/") ||
      (item.children?.some((child) => child.href === pathname) ?? false)


    const MenuComponent = item.href ? Link : "div"
    const menuProps = item.href ? { href: item.href } : {}

    return (
      <div key={item.label} className={level === 0 ? "mb-2" : ""}>
        <MenuComponent
          {...menuProps}
          className={`
            group flex items-center justify-between px-4 py-3.5 rounded-2xl cursor-pointer transition-all duration-300 ease-out
            ${level === 0
              ? isActive
                ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25 transform scale-[1.02]"
                : "hover:bg-white/80 hover:shadow-md text-gray-700 hover:text-primary-600 backdrop-blur-sm"
              : "hover:bg-gray-50 text-gray-600 hover:text-gray-800 ml-6 rounded-xl"
            }
            ${hasChildren && isExpanded && level === 0 ? "mb-2" : ""}
          `}
          onClick={() => (hasChildren ? toggleExpanded(item.label) : null)}
        >
          <div className="flex items-center space-x-3">
            <div
              className={`
              ${isActive && level === 0
                  ? "text-white"
                  : level === 0
                    ? "text-gray-500 group-hover:text-primary-500"
                    : "text-gray-400 group-hover:text-gray-600"
                } transition-colors duration-200
            `}
            >
              <Icon className={`${level > 0 ? "w-4 h-4" : "w-5 h-5"} ${level > 0 && isActive ? "text-primary" : ""}`} />
            </div>
            <span className={`font-medium transition-colors duration-200 ${level > 0 ? ("text-sm") : "text-base"} ${level > 0 && isActive ? "text-primary" : ""}`}>
              {item.label}
            </span>
          </div>
          {hasChildren && (
            <div className={`transition-all duration-300 ${isExpanded ? "rotate-0" : ""}`}>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 opacity-70" />
              ) : (
                <ChevronRight className="w-4 h-4 opacity-70" />
              )}
            </div>
          )}
        </MenuComponent>

        {hasChildren && (
          <div
            className={`
            overflow-hidden transition-all duration-300 ease-out
            ${isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
          `}
          >
            <div className="mt-2 space-y-1 pl-2">{item.children?.map((child) => renderMenuItem(child, level + 1))}</div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="w-80 bg-gradient-to-b from-white to-gray-50/50 h-screen shadow-xl border-r border-gray-100/50 overflow-y-auto backdrop-blur-sm">
      {/* Header with gradient background */}
      <div className="relative p-6 border-b border-gray-100/50">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-primary-100/50"></div>
        <div className="relative flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/25">
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

      {/* Navigation */}
      <nav className="p-6 space-y-1">{menuItems.map((item) => renderMenuItem(item))}</nav>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary-50/30 to-transparent pointer-events-none"></div>
    </div>
  )
}
