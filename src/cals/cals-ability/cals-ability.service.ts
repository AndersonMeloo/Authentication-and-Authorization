import { Ability, AbilityBuilder } from '@casl/ability';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';
import { Injectable, Scope } from '@nestjs/common';
import { Post, Roles, User } from '@prisma/client';

export type PermActions = 'manage' | 'create' | 'read' | 'update' | 'delete';

export type PermissionResource = Subjects<{ User: User; Post: Post }> | 'all';

export type AppAbility = Ability<
  [PermActions, PermissionResource],
  PrismaQuery
>;

export type DefinePermissions = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void;

const rolePermissionsMap: Record<Roles, DefinePermissions> = {
  ADMIN(user, { can }) {
    can('manage', 'all'); // Admins can do everything
  },
  EDITOR(user, { can }) {
    can('create', 'Post');
    can('read', 'Post');
    can('update', 'Post');
  },
  WRITER(user, { can }) {
    can('create', 'Post');
    can('read', 'Post', { authorId: user.id }); // Writers can only read their own posts
    can('update', 'Post', { authorId: user.id }); // Writers can only update their own posts
  },
  READER(user, { can }) {
    can('read', 'Post', { published: true }); // Readers can only read published posts
  },
};

@Injectable({ scope: Scope.REQUEST })
export class CalsAbilityService {
  ability!: AppAbility;

  createForUser(user: User) {
    const builder = new AbilityBuilder<AppAbility>(createPrismaAbility);
    // `permissions` is stored as JSON in the DB, typed by Prisma as JsonValue.
    // At runtime it may be an array of permission objects — validate and cast it.
    type StoredPermission = {
      action: PermActions;
      resource: PermissionResource;
      conditions?: Record<string, any>;
    };

    const isPermissionArray = (v: unknown): v is StoredPermission[] =>
      Array.isArray(v) && v.every((item) => {
        return (
          typeof item === 'object' &&
          item !== null &&
          'action' in item &&
          'resource' in item
        );
      });

    if (isPermissionArray(user.permissions)) {
      for (const permission of user.permissions) {
        builder.can(
          permission.action as PermActions,
          permission.resource as any,
          permission.conditions,
        );
      }
    }
    rolePermissionsMap[user.role](user, builder);
    const ability = builder.build();
    this.ability = ability;
    return ability;
  }
}
