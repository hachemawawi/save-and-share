"use client"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { hydrateRoot } from 'react-dom/client';

export default function Home() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Bienvenue sur Save&Share</h2>
      <p className="text-xl">Réduisez le gaspillage alimentaire en partageant vos surplus et en apprenant les bonnes pratiques.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Partager des aliments</CardTitle>
            <CardDescription>Publiez vos surplus alimentaires pour les partager avec d'autres</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/partager">Partager maintenant</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Rechercher des dons</CardTitle>
            <CardDescription>Trouvez des aliments partagés près de chez vous</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="secondary" className="w-full">
              <Link href="/rechercher">Rechercher des dons</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
    </div>
  )
}