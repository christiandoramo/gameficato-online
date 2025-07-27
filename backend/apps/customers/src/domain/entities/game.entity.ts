import type { Domain } from '@gameficato/common/helpers/domain.helper';

export interface Game extends Domain<string> {
  title: string;
  description: string;
}

export class GameEntity implements Game {
  id: string;
  title: string;
  description: string;

  constructor(props: Game | Domain<string>) {
    Object.assign(this, props);
  }
}
