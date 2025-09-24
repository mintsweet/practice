import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import { MIN_ROLE } from './constant';
import { createAuthGuard } from './create-auth-guard';

const AuthGuard = createAuthGuard(true);

export function Auth(minRole?: number) {
  const decorators = [UseGuards(AuthGuard)];
  if (minRole !== undefined) {
    decorators.push(SetMetadata(MIN_ROLE, minRole));
  }
  return applyDecorators(...decorators);
}
