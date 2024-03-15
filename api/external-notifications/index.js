import NotificationMethod from "../types/notificationMethod.enum.js";

import emailService from "./email/index.js";

//this object maps the notification methods inside the notificationMethod.enum with there concrete implementation
const notificationMethods = {
    [NotificationMethod.EMAIL]: emailService,
}
export default async function externalNotificationsHandler(
    user,
    notificationData,
    notificationType
) {
    // loops over the provided user to send external notifications to
    for (let k = 0; k < user.length; k++) {
        if (notificationType.isMandatory) {
            // automatically sends the notification through the first notification method in the notificationMethods object which is email
            await notificationMethods[0].dispatchNotification(notificationType.kind, notificationData, user[k].email);

        } else {
            //loops over the user's notification settings and checks if he has the setting for that notificationTypeKind
            for (let i = 0; i < user[k].notificationSettings.length; i++) {
                if (user[k].notificationSettings[i].notificationType === notificationType.kind) {

                    //loops over the user's notification methods and sends notifications through them
                    for (let j = 0; j < user[k].notificationSettings[i].notificationMethod.length; j++) {
                        await notificationMethods[user[k].notificationSettings[i].notificationMethod[j]].dispatchNotification(notificationType.kind, notificationData, user[k].email);
                    }

                    break;
                }
            }
        }
    }

}





