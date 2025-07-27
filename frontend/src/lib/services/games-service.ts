import { URL_GAMEPLAY, URL_GAMES } from "../api/base-urls";
import { useRequest } from "../hooks/useRequest";
import type { GameType } from "../types/game-type";
import { MethodsEnum } from "../utils/http-methods.enum";

interface GameService {
  getGames(): Promise<GameType[]>;
  playGame(gameId: string, navigate: (path: string) => void): void;
}
const { request } = useRequest();

export const gameService: GameService = new (class {
  async getGames(): Promise<GameType[]> {
    const gamesFound = await request<GameType[]>(URL_GAMES, MethodsEnum.GET);
    return gamesFound ?? [];
  }

  async playGame(
    gameId: string,
    navigate: (path: string) => void
  ): Promise<void> {
    // await request(`${URL_GAMEPLAY}/${gameId}`, MethodsEnum.GET).finally(() => {
      navigate(`${URL_GAMEPLAY}/${gameId}`);
      console.log("Iniciando o jogo: " + gameId);
    // });
  }
})();
