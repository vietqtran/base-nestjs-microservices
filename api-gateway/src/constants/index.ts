export enum CLIENT_NAMES {
    USERS_SERVICE = 'USERS_SERVICE'
}

export const CLIENT_KAFKA_OPTIONS = {
    users: {
        name: CLIENT_NAMES.USERS_SERVICE,
        clientId: 'api-gateway-users',
        groupId: 'api-gateway-users-consumer-group',
    }
}
