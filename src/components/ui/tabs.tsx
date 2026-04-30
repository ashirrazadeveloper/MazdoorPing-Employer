"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

interface TabsProps {
  tabs: { id: string; label: string; count?: number }[]
  activeTab: string
  onTabChange: (id: string) => void
  className?: string
}

export function Tabs({ tabs, activeTab, onTabChange, className }: TabsProps) {
  return (
    <div className={cn("flex gap-1 bg-gray-100 rounded-xl p-1", className)}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-all",
            activeTab === tab.id
              ? "bg-white text-primary shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={cn("ml-1.5 text-xs", activeTab === tab.id ? "text-primary" : "text-gray-400")}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
