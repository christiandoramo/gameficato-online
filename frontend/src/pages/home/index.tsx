'use client';

import {
  ShoppingCart,
  User,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { gameService } from '@/lib/services/games-service';
import type { GameType } from '@/lib/types/game-type';

export default function Home() {
  const [games, setGames] = useState<GameType[]>([]);

    useEffect(() => {
    gameService.getGames()
      .then(res => setGames(res))
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="min-h-screen bg-yellow-50">
      <header className="bg-teal-400 text-white px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <div className="font-bold text-lg">Gameficato</div>
                <div className="text-xs">ONLINE</div>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <a href="#" className="hover:underline">
                Home
              </a>
              <a href="#" className="hover:underline">
                Discover
              </a>
              <a href="#" className="hover:underline">
                Blog
              </a>
              <a href="#" className="hover:underline">
                About Us
              </a>
              <a href="#" className="hover:underline">
                Contact
              </a>
              <a href="#" className="hover:underline">
                Careers
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <User className="w-5 h-5" />
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <span className="text-teal-400 text-xs font-bold">?</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Jogos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {games.map((game, index) => (
              <Card key={index} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center"></div>
                  <img src={"https://placecats.com/neo/300/200"} />
                  <h3 className="font-medium text-sm mb-2">{game.title}</h3>
                  <div className="text-lg font-bold mb-2">{game.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <footer className="bg-blue-400 text-white mt-16">
            Criado por MIM 2025
      </footer>
    </div>
  );
}