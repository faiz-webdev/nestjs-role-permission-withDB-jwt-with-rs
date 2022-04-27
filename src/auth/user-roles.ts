import { RolesBuilder } from 'nest-access-control';

export enum UserRoles {
  Admin = 'Admin',
  SuperAdmin = 'SuperAdmin',
  Agent = 'Agent',
  Client = 'Client',
}

export const roles: RolesBuilder = new RolesBuilder();

roles
  .grant(UserRoles.Agent)
  .readOwn(['tasks'])
  .grant(UserRoles.Admin)
  .readAny(UserRoles.Agent)
  .createAny(['tasks'])
  .updateAny(['tasks'])
  .deleteAny(['tasks']);

console.log(roles.getGrants());

// let permission = roles.can(UserRoles.Reader).createOwn('tasks');
// console.log(permission.granted); // —> true
// console.log(permission.attributes); // —> ['*'] (all attributes)

// permission = roles.can(UserRoles.Admin).updateAny('tasks');
// console.log('admin: ', permission.granted); // —> true
// console.log('admin: ', permission.attributes); // —> ['title']
