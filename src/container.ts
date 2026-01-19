import { createContainer, asValue, InjectionMode } from 'awilix';
import { sql } from './shared/db.js';

export function configureContainer() {
  const container = createContainer({
    injectionMode: InjectionMode.PROXY,
  });

  container.register({
    sql: asValue(sql),
  });

  return container;
}

export const container = configureContainer();
