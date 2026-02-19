import { Role } from '@prisma/client';

export interface JwtPayloadWithId {
  id: string;
  role: Role;
  iat: number;
  exp: number;
}