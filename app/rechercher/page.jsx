"use client"

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Move formatDate outside component to ensure consistency
const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    // Use fixed locale and options to ensure consistency
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC' // Use UTC to avoid timezone issues
    }).format(date)
  } catch (error) {
    return dateString
  }
}

export default function SearchDonations() {
  const [mounted, setMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [categories, setCategories] = useState([])
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Only render after component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (!response.ok) throw new Error('Failed to fetch categories')
        const data = await response.json()
        setCategories(data)
      } catch (err) {
        setError('Error loading categories')
        console.error(err)
      }
    }
    fetchCategories()
  }, [])

  const fetchDonations = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/donations?searchTerm=${encodeURIComponent(searchTerm)}&categoryId=${selectedCategory}`
      )
      if (!response.ok) throw new Error('Failed to fetch donations')
      const data = await response.json()
      setDonations(data)
    } catch (err) {
      setError('Error loading donations')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (mounted) {
      fetchDonations()
    }
  }, [selectedCategory, mounted])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchDonations()
  }

  // Don't render anything until after hydration
  if (!mounted) {
    return null
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Rechercher des dons</h1>
      
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4 mb-4">
          <Input
            type="text"
            placeholder="Rechercher des dons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit" disabled={loading}>
            <Search className="mr-2 h-4 w-4" /> Rechercher
          </Button>
        </div>
      </form>

      {error && (
        <div className="text-red-500 bg-red-50 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Chargement...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donations.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-8">
              Aucun don trouvé
            </div>
          ) : (
            donations.map((donation) => (
              <Card key={donation.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{donation.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {donation.location}
                      </CardDescription>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {donation.category?.name}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-600">{donation.description}</p>
                  {donation.createdAt && (
                    <div className="mt-4 text-sm text-gray-500">
                      Partagé par {donation.user?.name || 'Anonyme'} le {formatDate(donation.createdAt)}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button className="w-full">
                    Contacter le donateur
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}