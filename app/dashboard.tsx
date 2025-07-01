"use client"

import Sidebar from "../components/sidebar"
import DashboardContent from "../components/dashboard-content"

export default function ChefitaDashboard() {
  return (
    <div className="flex h-screen bg-gray-50 font-poppins">
      <Sidebar />
      <DashboardContent />
    </div>
  )
}
