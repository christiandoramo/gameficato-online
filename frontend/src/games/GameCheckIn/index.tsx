// src/games/GameCheckIn.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  gameplayService,
  type CheckInConfirmationResponse,
} from "../gameplay-service";

export default function GameCheckIn() {
  const [result, setResult] = useState<CheckInConfirmationResponse | null>(
    null
  );

  const handleCheckIn = async () => {
    const data = await gameplayService.handleCheckIn("1adsaiasjd"); // mocked
    setResult(data ?? null);
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-neutral-800 p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Check-in Diário</h2>
      <p className="mb-4">Clique para receber suas moedas do dia!</p>
      <Button onClick={handleCheckIn}>"Fazer Check-in"</Button>
      {result && <p className="mt-4 font-medium">{result.message}</p>}
    </div>
  );
}
