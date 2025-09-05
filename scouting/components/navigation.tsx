"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Search, Users, FileText, Trophy, BarChart3, Plus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-slate-900 text-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Search className="h-6 w-6" />
            <span className="text-xl font-bold">RoboScout</span>
          </Link>

          <div className="flex items-center space-x-1">
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
                    <span className="hidden sm:inline">{item.name}</span>
                  </Link>
                </Button>
              )
            })}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-slate-800">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">Create</span>
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
        </div>
      </div>
    </nav>
  )
}
