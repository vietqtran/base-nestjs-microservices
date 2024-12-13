const RESOURCES = {
  USER: 'user',
  ROLE: 'role',
  SESSION: 'session',
  USER_CREDENTIAL: 'user_credential',
};

const ACTIONS = {
  CREATE: 'create',
  GET: 'get',
  LIST: 'list',
  UPDATE: 'update',
  DELETE: 'delete',
};

export const PERMISSIONS = Object.entries(ACTIONS).reduce(
  (permissionsObj, [, actionValue]) => {
    Object.entries(RESOURCES).forEach(([, resourceValue]) => {
      const permissionKey = `${actionValue}_${resourceValue}`;
      permissionsObj[permissionKey] = permissionKey;
    });
    return permissionsObj;
  },
  {},
);
