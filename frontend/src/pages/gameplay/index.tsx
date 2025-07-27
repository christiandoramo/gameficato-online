// frontend/src/pages/gameplay/index.tsx
import GameCheckIn from "@/games/GameCheckIn";
import type { JSX } from "react";
import { useParams } from "react-router-dom";

 const games: Record<number, JSX.Element> = {
  1: <GameCheckIn />,
  // 2: <OutroJogo />,
};

export default function Gameplay() {
  const { gameId } = useParams();
  const id = Number(gameId ?? 1);
  const currentGame = games[id] ?? <div>Jogo não encontrado</div>;

  return currentGame
}
