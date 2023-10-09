import { IsArray } from 'class-validator';

import type { PageMetaDto } from './page-meta.dto';

export class PageDto<T> {
  @IsArray()
  readonly records: T[];

  readonly meta: PageMetaDto;

  constructor(records: T[], meta: PageMetaDto) {
    this.records = records;
    this.meta = meta;
  }
}
