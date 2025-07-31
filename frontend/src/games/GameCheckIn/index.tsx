// src/games/GameCheckIn.tsx
import { useEffect, useState } from "react";
import { Modal, Spin } from "antd";
import { Button } from "@/components/ui/button";

import { URL_GAMEPLAY } from "@/lib/api/base-urls";
import { MethodsEnum } from "@/lib/utils/http-methods.enum";
import { useRequest } from "@/lib/hooks/useRequest";
import { getUserId } from "@/lib/api/auth";
import { useGlobalContext } from "@/lib/contexts/globalContext";

interface CheckInResponse {
  message: string;
  coinsReceived: number;
  status: "receivedNow" | "waitToReceive" | "error";
}

interface CalendarDay {
  coins: number;
  day: string;       // ISO
  received: boolean;
}

interface CalendarResponse {
  nextDayToReceive: { coins: number; day: string };
  calendarDays: CalendarDay[];
}

export default function GameCheckIn() {
  const { user } = useGlobalContext();
  const { request } = useRequest();

  const [calendar, setCalendar] = useState<CalendarDay[]>([]);
  const [loadingCal, setLoadingCal] = useState(false);
  const [checking, setChecking] = useState(false);

  const userId = user?.id || getUserId();
  const gameId = 1;

  /** busca o calendário */
  const fetchCalendar = async () => {
    setLoadingCal(true);
    try {
      const data = await request<CalendarResponse>(
        `${URL_GAMEPLAY}/${gameId}/${userId}/calendar`,
        MethodsEnum.GET
      );
      setCalendar(data?.calendarDays.slice(0, 30) ?? []);
    } catch {
      // placeholder: 30 dias com 0 moedas
      const placeholder: CalendarDay[] = Array.from({ length: 30 }).map((i, j) => ({
        coins: 0,
        day: j +"",//new Date().toISOString(),
        received: false,
      }));
      setCalendar(placeholder);
    } finally {
      setLoadingCal(false);
    }
  };

  /** faz check-in e revalida calendário */
  const handleCheckIn = async () => {
    setChecking(true);
    try {
      const res = await request<CheckInResponse>(
        `${URL_GAMEPLAY}/${gameId}`,
        MethodsEnum.POST,
        undefined,
        {
          userId,
          email: user?.email,
          storeId: user?.storeId,
        }
      );
      Modal.info({
        title: "Resultado do Check-in",
        content: res?.message ?? "Erro inesperado",
      });
    } finally {
      setChecking(false);
      fetchCalendar();
    }
  };

  useEffect(() => {
    fetchCalendar();
  }, []);

  return (
    <div className="flex flex-col items-center justify-start flex-1 overflow-auto bg-gray-100 p-8">
      {/* Card de CheckIn */}
      <div className="w-full max-w-lg bg-white dark:bg-neutral-800 p-8 rounded shadow-md text-center">
        <h2 className="text-3xl font-bold mb-4">Check-in Diário</h2>
        <p className="mb-6">Clique para receber suas moedas do dia!</p>
        <Button
          onClick={handleCheckIn}
          disabled={checking}
          className="px-6 py-2 text-lg"
        >
          {checking ? "Carregando..." : "Fazer Check-in"}
        </Button>
      </div>

      {/* Calendário */}
      <div className="w-full max-w-4xl mt-12">
        {loadingCal ? (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-4">
            {calendar.map((day, idx) => {
              const dateNum = idx + 1;
              return (
                <div
                  key={idx}
                  className={`
                    flex flex-col items-center p-4 rounded-lg border
                    ${day.received ? "bg-green-100 border-green-400" : "bg-white border-gray-300"}
                  `}
                >
                  <span className="text-sm text-gray-500 mb-1">
                    {new Date(day.day).toLocaleDateString()}
                  </span>
                  <span className="text-xl font-semibold">{dateNum}</span>
                  <span className="text-sm text-gray-700 mt-1">
                    +{day.coins} 🪙
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
