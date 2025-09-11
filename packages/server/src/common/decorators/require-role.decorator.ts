import { SetMetadata } from '@nestjs/common';

export const ROLE_KEY = 'role_min';
export const RequireRole = (minRole: number) => SetMetadata(ROLE_KEY, minRole);
