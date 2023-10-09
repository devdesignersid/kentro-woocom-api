import type { IKentroApiConfig } from '../types';
import type { IKentroClient } from './kentro-client.interface';

export interface IKentroService {
  getClient(config: IKentroApiConfig): Promise<IKentroClient | undefined>;
}
