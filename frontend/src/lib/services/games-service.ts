// frontend/src/lib/services/games-service.ts
import { URL_GAMEPLAY, URL_GAMES } from "../api/base-urls";
import { useRequest } from "../hooks/useRequest";
import type { GameType } from "../types/game-type";
import { MethodsEnum } from "../utils/http-methods.enum";

export const useGameService = () => {
    const { request } = useRequest()

  const getGames = async (): Promise<GameType[]> => {
    const gamesFound = await request<GameType[]>(URL_GAMES, MethodsEnum.GET);
    return gamesFound ?? [];
  }

    const playGame = async (
    gameId: number,
    navigate: (path: string) => void
  ): Promise<void> => {
      navigate(`${URL_GAMEPLAY}/${gameId}`);
      console.log("Iniciando o jogo: " + gameId);
  }
  return {getGames, playGame}
};
