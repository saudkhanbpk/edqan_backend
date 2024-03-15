import AccessControl from 'accesscontrol';

const roles = Object.freeze({
    STUDENT: 0,
    COMPANY: 0,
    INSTITUTION: 0,
    MENTOR: 0,
});
const adminRoles = Object.freeze({
    SUPER_ADMIN: 0,
    STUDENT_ADMIN: 1,
    COMPANY_ADMIN: 2,
    INSTITUTION_ADMIN: 3,
    MENTOR_ADMIN: 4,
});
const resources = Object.freeze({
    USER: 0
});

const permissions = {
    [roles.USER]: {
        [resources.USER]: {
            'create:own': ['*',],
            'read:any': ['*', '!firstName'],
            'read:own': ['*', '!restrictions', '!fees', '!personal.dateOfLastMonthlyFees', '!business.dateOfLastMonthlyFees','balance','contacts'],
            'update:own': ['*']
        },
        [resources.TRANSFER]: {
            'create:own': ['sender', 'receivers', 'state'],
            'read:own': ['sender', 'receivers', 'state'],
            'update:own': ['state']
        },
        [resources.CREDIT_CARD]: {
            'create:own': ['*'],
            'read:own': ['*'],
            'delete:own': ['*']
        },
        [resources.TRANSACTION]: {
            'create:own': ['*'],
            'read:own': ['*']
        }
    },
}

const accessControl = new AccessControl(permissions);
accessControl.lock();

export {
    accessControl,
    roles,
    adminRoles,
    resources
}