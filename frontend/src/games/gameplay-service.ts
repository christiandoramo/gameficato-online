import { URL_GAMEPLAY } from "@/lib/api/base-urls";
import { useRequest } from "@/lib/hooks/useRequest";
import { MethodsEnum } from "@/lib/utils/http-methods.enum";

export interface CheckInConfirmationResponse{
  message: string;
  valueReceived: number;
  status: 'receivedNow' | 'waitToReceive' | 'error';
}

export interface CalendarCheckIn{
  nextDayToReceive: {coins: number, day: Date};
  calendarDays: {coins: number, day: Date, received: boolean}[];
}

const { request } = useRequest();

export const gameplayService = new (class {
  async handleCheckIn(userId: string){
    const res = await request<CheckInConfirmationResponse>(`${URL_GAMEPLAY}/${1}/${userId}`, MethodsEnum.GET)
    return res
  }
})();
