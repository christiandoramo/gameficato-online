// src/games/GameCheckIn.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";

import { URL_GAMEPLAY } from "@/lib/api/base-urls";
import { MethodsEnum } from "@/lib/utils/http-methods.enum";
import { useRequest } from "@/lib/hooks/useRequest";

interface CheckInConfirmationResponse {
  message: string;
  valueReceived: number;
  status: "receivedNow" | "waitToReceive" | "error";
}

// interface CalendarCheckIn {
//   nextDayToReceive: { coins: number; day: Date };
//   calendarDays: { coins: number; day: Date; received: boolean }[];
// }

export default function GameCheckIn() {
  const [result, setResult] = useState<CheckInConfirmationResponse | null>(
    null
  );

  const { request } = useRequest();

  const handleCheckIn = async () => {
    const data = await request<CheckInConfirmationResponse>(
      `${URL_GAMEPLAY}/${1}/${"userId-dasdsdasdasdasd"}`,
      MethodsEnum.GET
    );
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
