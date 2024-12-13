export enum CLIENT_NAMES {
  API_GATEWAY = 'API_GATEWAY',
  USERS_SERVICE = 'USERS_SERVICE',
  AUTH_SERVICE = 'AUTH_SERVICE',
  IDENTITY_SERVICE = 'IDENTITY_SERVICE',
}

export const CLIENT_KAFKA_OPTIONS = {
  apiGateway: {
    name: CLIENT_NAMES.API_GATEWAY,
    clientId: 'api-gateway',
    groupId: 'api-gateway-consumer-group',
  },
  users: {
    name: CLIENT_NAMES.USERS_SERVICE,
    clientId: 'api-gateway-users-service',
    groupId: 'users-consumer-group',
  },
  auth: {
    name: CLIENT_NAMES.AUTH_SERVICE,
    clientId: 'api-gateway-auth-service',
    groupId: 'auth-consumer-group',
  },
  identity: {
    name: CLIENT_NAMES.IDENTITY_SERVICE,
    clientId: 'api-gateway-identity-service',
    groupId: 'identity-consumer-group',
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
