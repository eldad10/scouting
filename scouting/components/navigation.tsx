"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Search, Users, FileText, Trophy, BarChart3, Plus, Menu, X } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"

const navigationItems = [
  {
    name: "Teams",
    href: "/teams",
    icon: Users,
  },
  {
    name: "Forms",
    href: "/forms",
    icon: FileText,
  },
  {
    name: "Rankings",
    href: "/rankings",
    icon: Trophy,
  },
  {
    name: "Statistics",
    href: "/statistics",
    icon: BarChart3,
  },
]

export function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-slate-900 text-white">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Search className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="text-lg sm:text-xl font-bold">RoboScout</span>
          </Link>

          <div className="hidden sm:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Button
                  key={item.name}
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  asChild
                  className={cn(
                    "text-white hover:text-white hover:bg-slate-800",
                    isActive && "bg-slate-700 text-white hover:bg-slate-700",
                  )}
                >
                  <Link href={item.href} className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                </Button>
              )
            })}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-slate-800">
                  <Plus className="h-4 w-4" />
                  <span className="ml-2">Create</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/create-form" className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>New Form</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/create-team" className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>New Team</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="sm:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:text-white hover:bg-slate-800"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="sm:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed right-0 top-0 h-full w-64 bg-slate-900 border-l border-border shadow-lg">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-white">Menu</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-white hover:bg-slate-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="p-4 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors w-full",
                      isActive ? "bg-slate-700 text-white" : "text-slate-300 hover:text-white hover:bg-slate-800",
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )
              })}

              <div className="pt-4 border-t border-slate-700">
                <div className="text-sm font-medium text-slate-400 mb-2">Create New</div>
                <Link
                  href="/create-form"
                  className="flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors w-full text-slate-300 hover:text-white hover:bg-slate-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FileText className="h-5 w-5" />
                  <span>New Form</span>
                </Link>
                <Link
                  href="/create-team"
                  className="flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors w-full text-slate-300 hover:text-white hover:bg-slate-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Users className="h-5 w-5" />
                  <span>New Team</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
