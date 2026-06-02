import { SetMetadata } from '@nestjs/common';
import type {
  PermissionResource,
  PermActions,
} from './cals-ability/cals-ability.service';

export const RequiredPermissions = (
  action: PermActions,
  subject: PermissionResource,
) => SetMetadata('permissions', { action, subject });
