export enum CLIENT_NAMES {
  USERS_SERVICE = 'USERS_SERVICE',
}

export const CLIENT_KAFKA_OPTIONS = {
  users: {
    name: CLIENT_NAMES.USERS_SERVICE,
    clientId: 'api-gateway-users',
    groupId: 'api-gateway-users-consumer-group',
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
