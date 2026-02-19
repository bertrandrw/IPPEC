// src/types/custom.d.ts

import { Request } from 'express';
import { User } from '@prisma/client';

// Define our custom interface that extends the base Express Request
export interface IAuthRequest extends Request {
  user?: User; // Add our custom 'user' property
}
