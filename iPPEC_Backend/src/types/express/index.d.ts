// src/types/express/index.d.ts

import { User } from '@prisma/client';

// Use `declare namespace` to merge with the existing Express namespace.
declare namespace Express {
  export interface Request {
    user?: User; // The user property will be optional and of type User from Prisma
  }
}