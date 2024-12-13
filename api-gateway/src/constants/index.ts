export enum CLIENT_NAMES {
  USERS_SERVICE = 'USERS_SERVICE',
  AUTH_SERVICE = 'AUTH_SERVICE',
  IDENTITY_SERVICE = 'IDENTITY_SERVICE',
}

export const CLIENT_KAFKA_OPTIONS = {
  users: {
    name: CLIENT_NAMES.USERS_SERVICE,
    clientId: 'api-gateway-users-service',
    groupId: 'users-service-consumer-group',
  },
  auth: {
    name: CLIENT_NAMES.AUTH_SERVICE,
    clientId: 'api-gateway-auth-service',
    groupId: 'auth-service-consumer-group',
  },
  identity: {
    name: CLIENT_NAMES.IDENTITY_SERVICE,
    clientId: 'api-gateway-identity-service',
    groupId: 'identity-service-consumer-group',
  },
};

export const DECORATOR_KEYS = {
  IS_PUBLIC_KEY: 'isPublic',
  ROLES_KEY: 'roles',
  SEND_MAIL: 'send-mail',
  UPLOAD_AVATAR: 'upload-avatar',
  DELETE_IMAGE: 'delete-image',
};

export const QUEUES = {
  MAIL_QUEUE: 'queue:mail',
  UPLOAD_AVATAR_QUEUE: 'queue:upload-avatar',
  DELETE_IMAGE_QUEUE: 'queue:delete-image',
};
