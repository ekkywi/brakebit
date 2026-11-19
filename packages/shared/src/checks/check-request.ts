import type { Chain } from "../chains";

export interface CreateCheckRequest {
  address: string;
  chain?: Chain;
}
