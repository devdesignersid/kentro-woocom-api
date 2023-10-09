import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import type { IKentroApiConfig } from '../types';
import type { IKentroService } from './kentro.service.interface';
import { KentroClient } from './kentro-client';
import type { IKentroClient } from './kentro-client.interface';

@Injectable()
export class KentroService implements IKentroService {
  constructor(private readonly httpService: HttpService) {}

  public async getClient(
    config: IKentroApiConfig,
  ): Promise<IKentroClient | undefined> {
    return KentroClient.new(this.httpService, config);
  }
}
