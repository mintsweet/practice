import { SetMetadata } from '@nestjs/common';

// Use role number to distinguish permission levels
export const Role = (role = 1) => SetMetadata('role', role);
