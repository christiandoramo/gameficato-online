import type { Domain } from '@gameficato/common/helpers/domain.helper';

export interface Store extends Domain<string> {
  name: string;
}

export class StoreEntity implements Store {
  id: string;
  name: string;

  constructor(props: Store | Domain<string>) {
    Object.assign(this, props);
  }
}
