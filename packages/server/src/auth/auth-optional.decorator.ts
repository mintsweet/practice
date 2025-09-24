import { applyDecorators, UseGuards } from '@nestjs/common';

import { createAuthGuard } from './create-auth-guard';

const AuthGuardOptional = createAuthGuard(false);

export function AuthOptional() {
  return applyDecorators(UseGuards(AuthGuardOptional));
}
