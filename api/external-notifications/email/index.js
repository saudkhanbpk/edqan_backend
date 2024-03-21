import sendGrid from "@sendgrid/mail";
sendGrid.setApiKey(process.env.SENDGRID_API_KEY);

import NotificationTypes from "../../types/notificationType.enum.js";

// TODO: approve this approach to calling functions

const notificationTypesTemplates = {
    [NotificationTypes.MENTOR_RECEIVES_SESSION_REQUEST]: 'd-9dca4c92f50746fb93d8cebcc7d2e88a',
    [NotificationTypes.MENTOR_VERIFICATION]: 'd-b8a4b6fd5d1b49f09a09a29eed3c4604',
    [NotificationTypes.AFTER_MENTOR_VERIFIED]: 'd-c6eb873ef07c4a3db1c0b63cd0c6fd70',
    [NotificationTypes.REMIND_MENTOR_TO_REVIEW_MENTEE]: 'd-00e5728a06634652b4a82fb462d3fa10',
    [NotificationTypes.STUDENT_CREATES_REVIEW]: 'd-d21a155206814ff5a73115046554cd10',
    [NotificationTypes.JOB_APPLICATION_STATUS_CHANGED]: 'd-d2d3199d37d54630b3bfc76bed8a560d',
    [NotificationTypes.STUDENT_APPLIED_FOR_JOB]: 'd-2106e2b840024115a2abd4268224b45c',
    [NotificationTypes.STUDENT_UPLOADED_DOCUMENT]: 'd-0dd8dc87824b4677bc86b8e70bff89fb',
    [NotificationTypes.STUDENT_DOCUMENT_APPROVED_BY_ADMIN]: 'd-f3e7468f8bec4fc9aef9de7f51eb3338',
    [NotificationTypes.STUDENT_VERIFICATION]: 'd-b7c5a6ef2f4e4d88a070ddab2ab0393e',
    [NotificationTypes.AFTER_STUDENT_VERIFIED]: 'd-0539650f09094731acc635cb6e375b7f',
    [NotificationTypes.MENTOR_DECLINES_SESSION]: 'd-41c21f1eb0234662b71334b7e8a729df',
    [NotificationTypes.REMIND_MENTEE_TO_REVIEW_MENTOR]: 'd-af579b2facbc4965834fc7ac570e49b9',
    [NotificationTypes.STUDENT_APPLIES_FOR_JOB]: 'd-77109282337e4c46be2b26385492af93',
    [NotificationTypes.COMPANY_WAITS_FOR_APPROVAL_FROM_ADMIN_AFTER_PROFILE_UPDATE]: 'd-556d0a0b10fd444cb323b3c1a03c7782',
    [NotificationTypes.COMPANY_SIGN_UP]: 'd-574b94c55c65476c9dd2ae16cee313e1',
    [NotificationTypes.COMPANY_VERIFICATION]: 'd-b8420a4950564c8fb7766c119d093fe0',
    [NotificationTypes.COMPANY_UPDATED_JOB_POST]: 'd-83a1c8ca1378421382f0bded289d1bff',
    [NotificationTypes.COMPANY_POSTED_JOB]: 'd-d71a4fb2a6ca4f92a6d8cb3c822db1bd',
    [NotificationTypes.JOB_APPROVED_BY_ADMIN]: 'd-ec542d1b1cae45c4b8036c74b49cd21c',
    [NotificationTypes.COMPANY_APPROVED_BY_ADMIN]: 'd-c5ef1425c5a24122927eb5897ac53cec',
    [NotificationTypes.INSTITUTION_SIGN_UP]: 'd-f7cbffaccba1423a8d16d99499cf3bf2',
    [NotificationTypes.INSTITUTION_APPROVED_BY_ADMIN]: 'd-3a46240762d549039af5ec2e389ee76d',
    [NotificationTypes.INSTITUTION_WAITS_FOR_APPROVAL_FROM_ADMIN_AFTER_PROFILE_UPDATE]: 'd-3d9dab9e9f01420b9afd81a5a718b95f',
    [NotificationTypes.USER_CHANGED_PASSWORD]: 'd-e5176c35c0c94387a8d68a6436c7ee4c',
    [NotificationTypes.MESSAGE_RECEIVED]: 'd-03748e3804164184b667728bdd2a4df1',
    [NotificationTypes.PASSWORD_RESET]: 'd-6560864cadd148718f427dc556928015',
    [NotificationTypes.MENTOR_APPROVES_SESSION_FOR_MENTOR]: 'd-66f8a936f4134bbf8a18ddcad65102b4', // REMEMBER TO ALWAYS SEND THE STUDENT TIPS TEMPLATE 
    [NotificationTypes.STUDENT_MENTOR_ACCOUNT_UPDATE]: 'd-2b66636abe94419a9404119a14998f74',
    [NotificationTypes.REVIEW_IS_APPROVED_BY_ADMIN_FOR_COMPANY]: 'd-a14afb9d0e6949ba8d94e262644b0192',
    [NotificationTypes.INFO_ABOUT_SESSION]: 'd-b5acb984deb342fd90a94d31aa2d8b56',
    [NotificationTypes.MENTOR_APPROVES_SESSION_FOR_STUDENT]: 'd-af84c8cd53e84c0c9454e55e0f31ff2b',
    [NotificationTypes.REVIEW_IS_APPROVED_BY_ADMIN_FOR_STUDENT]: 'd-1e24f417ad994c1d9380f9f11dd74e17',
}

async function dispatchNotification(notificationKind, notificationData, userEmail) {
    try {
        const message = {
            from: {
                email: process.env.SENDGRID_SENDER_EMAIL,
                name: 'edqan'
            },
            to: userEmail,
            template_id: notificationTypesTemplates[notificationKind],
            dynamic_template_data: { ...notificationData }
        }
        return 
        await sendGrid.send(message);
    } catch (error) {
        throw new Error('Sendgrid error sending notification, this action was successful but notification didn\'t go through, please refresh the page.')
    }
}

export default {
    dispatchNotification
}
