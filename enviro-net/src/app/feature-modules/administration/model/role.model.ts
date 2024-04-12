export enum Role {
    ADMIN = 'Admin',
    REGISTERED_USER = 'Registered User',
    ACCOUNTANT = 'Accountant',
    BOARD_MEMBER = 'Board Member',
    PROJECT_MANAGER = 'Project Manager',
    PROJECT_COORDINATOR = 'Project Coordinator',
    EDUCATOR = 'Educator',
}

export const RoleOrdinals = {
    [Role.ADMIN]: 0,
    [Role.REGISTERED_USER]: 1,
    [Role.ACCOUNTANT]: 2,
    [Role.BOARD_MEMBER]: 3,
    [Role.PROJECT_MANAGER]: 4,
    [Role.PROJECT_COORDINATOR]: 5,
    [Role.EDUCATOR]: 6,
};
