// src/pages/gameplay/index.tsx

"use client";
import { useParams } from "react-router-dom";

export default function Gameplay() {
  const { gameId } = useParams();
  return (
    <div className="min-h-screen bg-yellow-50">
      Switch de jogos por id: {gameId} - vai carregar o componente do jogo
      direto aqui
    </div>
  );
}
