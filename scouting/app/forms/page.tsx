"use client"

import { useState, useEffect } from "react"
import { Search, User, Eye, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { api } from "@/lib/api"

export default function FormsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState("all")
  const [sortBy, setSortBy] = useState("match")
  const [forms, setForms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchForms = async () => {
      try {
        setLoading(true)
        const formsData = await api.getForms()
        setForms(formsData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchForms()
  }, [])

  useEffect(() => {
    const searchForms = async () => {
      if (searchTerm.trim()) {
        try {
          setLoading(true)
          const filters = {}
          if (filterBy === "team") filters.teamNumber = searchTerm
          else if (filterBy === "match") filters.matchNumber = searchTerm
          else if (filterBy === "scout") filters.scouterName = searchTerm

          const searchResults = await api.getForms(filters)
          setForms(searchResults)
        } catch (err) {
          setError(err.message)
        } finally {
          setLoading(false)
        }
      } else {
        const allForms = await api.getForms()
        setForms(allForms)
      }
    }

    const debounceTimer = setTimeout(searchForms, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchTerm, filterBy])

  const filteredForms = forms
    .map((form) => ({
      ...form,
      totalScore:
        form.l1CoralsAuto +
        form.l2CoralsAuto +
        form.l3CoralsAuto +
        form.l4CoralsAuto +
        form.netAuto +
        form.l1CoralsTele +
        form.l2CoralsTele +
        form.l3CoralsTele +
        form.l4CoralsTele +
        form.netTele +
        form.processor,
    }))
    .filter((form) => {
      if (filterBy === "all") {
        return (
          form.teamNumber.includes(searchTerm) ||
          form.matchNumber.toString().includes(searchTerm) ||
          form.scouterName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      } else if (filterBy === "team") {
        return form.teamNumber.includes(searchTerm)
      } else if (filterBy === "match") {
        return form.matchNumber.toString().includes(searchTerm)
      } else if (filterBy === "scout") {
        return form.scouterName.toLowerCase().includes(searchTerm.toLowerCase())
      }
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "match":
          return a.matchNumber - b.matchNumber
        case "team":
          return Number.parseInt(a.teamNumber) - Number.parseInt(b.teamNumber)
        case "score":
          return b.totalScore - a.totalScore
        default:
          return a.matchNumber - b.matchNumber
      }
    })

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Scouting Forms</h1>
          <p className="text-muted-foreground">Browse and manage scouting forms from qualification matches</p>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading forms...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Scouting Forms</h1>
          <p className="text-muted-foreground">Browse and manage scouting forms from qualification matches</p>
        </div>
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Error loading forms</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Scouting Forms</h1>
        <p className="text-muted-foreground">Browse and manage scouting forms from qualification matches</p>
      </div>

      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by team number, match number, or scout name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="sm:w-48">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Fields</SelectItem>
              <SelectItem value="team">Team Number</SelectItem>
              <SelectItem value="match">Match Number</SelectItem>
              <SelectItem value="scout">Scout Name</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="sm:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="match">Match Number</SelectItem>
              <SelectItem value="team">Team Number</SelectItem>
              <SelectItem value="score">Total Score</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Showing {filteredForms.length} of {forms.length} forms
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredForms.map((form) => (
          <Card key={form.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">
                    Team {form.teamNumber} - Match {form.matchNumber}
                  </CardTitle>
                  <CardDescription className="font-medium text-foreground">Qualification Match</CardDescription>
                </div>
                <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Completed
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  {form.scouterName}
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-foreground">{form.totalScore}</div>
                  <div className="text-xs text-muted-foreground">Total Score</div>
                </div>
              </div>

              {form.comments && <p className="text-sm text-muted-foreground line-clamp-2">{form.comments}</p>}

              <Button asChild className="w-full" size="sm">
                <Link href={`/forms/${form.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredForms.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No forms found</h3>
          <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
        </div>
      )}
    </div>
  )
}
