// app/search/page.tsx
'use client'

import { useState } from 'react'

// Mock data - in a real application, this would come from a backend
const mockDonations = [
  {
    id: '1',
    title: 'Pommes mûres',
    description: 'Plusieurs pommes mûres, parfaites pour la compote ou la tarte',
    quantity: '1 kg',
    distance: '2 km',
    expiryDate: '2024-03-15',
    location: 'Paris 10e',
    category: 'Fruits'
  },
  {
    id: '2',
    title: 'Pain frais',
    description: 'Pain complet fraîchement cuit, légèrement rassis',
    quantity: '2 baguettes',
    distance: '1.5 km',
    expiryDate: '2024-03-10',
    location: 'Paris 11e',
    category: 'Pain'
  },
  {
    id: '3',
    title: 'Légumes invendus',
    description: 'Mélange de légumes biologiques : carottes, courgettes, poivrons',
    quantity: '1.5 kg',
    distance: '3 km',
    expiryDate: '2024-03-12',
    location: 'Paris 12e',
    category: 'Légumes'
  }
]

export default function SearchDonationsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [maxDistance, setMaxDistance] = useState(5)

  // Filter donations based on search criteria
  const filteredDonations = mockDonations.filter(donation => 
    (searchTerm === '' || 
      donation.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      donation.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedCategory === '' || donation.category === selectedCategory) &&
    (parseFloat(donation.distance) <= maxDistance)
  )

  // Get unique categories from mock data
  const categories = [...new Set(mockDonations.map(d => d.category))]

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6 text-green-700">
        Rechercher des dons alimentaires
      </h1>

      {/* Search and Filter Section */}
      <div className="mb-6 grid md:grid-cols-3 gap-4">
        {/* Search Input */}
        <div>
          <label className="block mb-2 text-gray-700">Recherche</label>
          <input 
            type="text" 
            placeholder="Rechercher des aliments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Category Filter */}
        <div>
          <label className="block mb-2 text-gray-700">Catégorie</label>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Toutes les catégories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Distance Filter */}
        <div>
          <label className="block mb-2 text-gray-700">
            Distance maximale : {maxDistance} km
          </label>
          <input 
            type="range" 
            min="1" 
            max="10" 
            value={maxDistance}
            onChange={(e) => setMaxDistance(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Donations Grid */}
      {filteredDonations.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDonations.map(donation => (
            <div 
              key={donation.id} 
              className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2 text-green-600">
                {donation.title}
              </h2>
              <p className="text-gray-700 mb-2">{donation.description}</p>
              
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                <div>
                  <strong>Quantité:</strong> {donation.quantity}
                </div>
                <div>
                  <strong>Distance:</strong> {donation.distance}
                </div>
                <div>
                  <strong>Expire le:</strong> {donation.expiryDate}
                </div>
                <div>
                  <strong>Lieu:</strong> {donation.location}
                </div>
              </div>

              <button 
                className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
              >
                Réserver
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-10">
          <p>Aucun don trouvé correspondant à vos critères.</p>
        </div>
      )}

      {/* Stats */}
      <div className="mt-6 text-center text-gray-600">
        <p>
          {filteredDonations.length} dons trouvés sur {mockDonations.length} disponibles
        </p>
      </div>
    </div>
  )
}