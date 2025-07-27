// frontend/src/pages/home/index.tsx
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { GameType } from "@/lib/types/game-type";
import { useNavigate } from "react-router-dom";
import { useRequest } from "@/lib/hooks/useRequest";
import { URL_GAMEPLAY, URL_GAMES } from "@/lib/api/base-urls";
import { MethodsEnum } from "@/lib/utils/http-methods.enum";

export default function Home() {
  const [games, setGames] = useState<GameType[]>([]);
  const navigate = useNavigate();

  const { request } = useRequest();

  const getGames = async (): Promise<GameType[]> => {
    const gamesFound = await request<GameType[]>(URL_GAMES, MethodsEnum.GET);
    return gamesFound ?? [];
  };

  const playGame = async (
    gameId: number,
    navigate: (path: string) => void
  ): Promise<void> => {
    navigate(`${URL_GAMEPLAY}/${gameId}`);
    console.log("Iniciando o jogo: " + gameId);
  };

  useEffect(() => {
    getGames()
      .then((res) => setGames(res))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-yellow-50">
      <header className="bg-teal-400 text-white px-4 py-3"></header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Jogos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {games.map((game, index) => (
              <Card
                key={index}
                className="bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent
                  onClick={() => playGame(game.id, navigate)}
                  className="p-4"
                >
                  <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center"></div>
                  <img src={"https://placecats.com/neo/300/200"} />
                  <h3 className="font-medium text-sm mb-2">{game.title}</h3>
                  <div className="text-lg font-bold mb-2">
                    {game.description}
                  </div>
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
