import type { ObjectValues } from '../types';

export const ORDER = {
  ASC: 'ASC',
  DESC: 'DESC',
} as const;

export type Order = ObjectValues<typeof ORDER>;
