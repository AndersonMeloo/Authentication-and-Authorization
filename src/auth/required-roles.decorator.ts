import { SetMetadata } from '@nestjs/common';
import { Roles } from '@prisma/client';

export const RequiredRoles = (...roles: Roles[]) => SetMetadata('roles', roles);

// Decorator - JavaScript - Design Pattern
// Documentar algo
// Influenciar o comportamento de algo
