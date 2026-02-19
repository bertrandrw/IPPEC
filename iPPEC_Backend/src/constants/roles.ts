import { Role } from '@prisma/client';

// We use Object.freeze to prevent any accidental modification of these values anywhere in the app.
export const ROLES: Record<Role, Role> = Object.freeze({
  PATIENT: 'PATIENT',
  DOCTOR: 'DOCTOR',
  PHARMACIST: 'PHARMACIST',
  ADMIN: 'ADMIN',
  INSURER: 'INSURER'
});