export interface GameType {
  id: number;
  title: string;
  description: string;
  gameCategory:
    | "roleta"
    | "dispatch"
    | "pinball"
    | "others"
    | "rocket"
    | "match3"
    | "daily";
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  createdAt: Date;
}
