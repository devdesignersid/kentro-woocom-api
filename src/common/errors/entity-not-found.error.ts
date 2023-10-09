import type { AnyEntity } from '@mikro-orm/core';

export class EntityNotFoundError extends Error {
  constructor(entity: string | AnyEntity) {
    const entityName = typeof entity === 'string' ? entity : entity.name;
    super(`${entityName} not found`);
    this.name = 'EntityNotFoundError';
  }
}
