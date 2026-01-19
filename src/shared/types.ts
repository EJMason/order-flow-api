import type { Request } from 'express';
import type { AwilixContainer } from 'awilix';

export interface AppRequest extends Request {
  container: AwilixContainer<Cradle>;
}

// Will be populated as services are added
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Cradle {}

export type { Transaction } from './db.js';
