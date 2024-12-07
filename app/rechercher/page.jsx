"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SearchDonations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]); // New state for filtered results

  // Fetch donations from API
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch("/api/donations/");
        if (!response.ok) throw new Error("Failed to fetch donations.");
        const data = await response.json();
        setDonations(data);
        setFilteredDonations(data); // Initialize filteredDonations
      } catch (error) {
        console.error("Error fetching donations:", error);
      }
    };

    fetchDonations();
  }, []);

  // Handle Search
  const handleSearch = (e) => {
    e.preventDefault();

    const results = donations.filter(
      (donation) =>
        donation.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (category === "all" || category === "" || donation.location === category)
    );

    setFilteredDonations(results); // Update filteredDonations
  };

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
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les villes</SelectItem>
              <SelectItem value="Paris">Paris</SelectItem>
              <SelectItem value="Lyon">Lyon</SelectItem>
              <SelectItem value="Marseille">Marseille</SelectItem>
              <SelectItem value="Toulouse">Toulouse</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit">
            <Search className="mr-2 h-4 w-4" /> Rechercher
          </Button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDonations.map((donation) => (
          <Card key={donation.id}>
            <CardHeader>
              <CardTitle>{donation.title}</CardTitle>
              <CardDescription>{donation.location} - {donation.distance || "N/A"}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{donation.description}</p>
            </CardContent>
            <CardFooter>
              <Button>Contacter le donateur</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
