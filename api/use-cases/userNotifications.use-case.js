import { userNotificationsRepo, userRepo, adminRepo, notificationTypeRepo } from "../data-access-layer/index.js";
import notificationTypeEnum from "../types/notificationType.enum.js";
import externalNotificationsHandler from "../external-notifications/index.js";
import notificationStatusEnum from "../types/notificationStatus.enum.js";
import notificationTypeClassEnum from "../types/notificationTypeClass.enum.js";
import { makeUserNotifications } from "../entities/index.js";

// this object will change all dynamic data in the toBeFormattedMessage with the notificationData based on the notification type
const notificationTypeMessageFormatter = {
  [notificationTypeEnum.USER_CHANGED_PASSWORD]: (toBeFormattedMessage, notificationData) => {
    return {
      text: toBeFormattedMessage,
    };
  },
  [notificationTypeEnum.MESSAGE_RECEIVED]: (toBeFormattedMessage, notificationData) => {
    return {
      text: toBeFormattedMessage.replace("{senderName}", notificationData.senderName),
    };
  },
  [notificationTypeEnum.PASSWORD_RESET]: (toBeFormattedMessage, notificationData) => {
    return {
      text: toBeFormattedMessage,
    };
  },
  [notificationTypeEnum.STUDENT_MENTOR_ACCOUNT_UPDATE]: (toBeFormattedMessage, notificationData) => {
    return {
      text: toBeFormattedMessage,
    };
  },
  [notificationTypeEnum.MENTOR_APPROVES_SESSION_FOR_MENTOR]: (toBeFormattedMessage, notificationData) => {
    return {
      text: toBeFormattedMessage.replace("{menteeName}", notificationData.menteeName),
    };
  },
  [notificationTypeEnum.REVIEW_IS_APPROVED_BY_ADMIN_FOR_COMPANY]: (toBeFormattedMessage, notificationData) => {
    return {
      text: toBeFormattedMessage.replace("{studentName}", notificationData.studentName),
    };
  },
  [notificationTypeEnum.MENTOR_RECEIVES_SESSION_REQUEST]: (toBeFormattedMessage, notificationData) => {
    return {
      text: toBeFormattedMessage.replace("{studentName}", notificationData.studentName),
    };
  },
  [notificationTypeEnum.MENTOR_VERIFICATION]: (toBeFormattedMessage, notificationData) => {
    return {
      text: toBeFormattedMessage,
    };
  },
  [notificationTypeEnum.AFTER_MENTOR_VERIFIED]: (toBeFormattedMessage, notificationData) => {
    return {
      text: toBeFormattedMessage.replace("{mentorName}", notificationData.userName),
       // the property is called text because it's the property name in the userNotification model
      //TODO: to return notification link
    };
  },
  [notificationTypeEnum.REMIND_MENTOR_TO_REVIEW_MENTEE]: (toBeFormattedMessage, notificationData) => {
    return {
      text: toBeFormattedMessage.replace("{menteeName}", notificationData.menteeName),
    };
  },
  [notificationTypeEnum.STUDENT_CREATES_REVIEW]: (toBeFormattedMessage, notificationData) => {
    return {
      text: toBeFormattedMessage.replace("{companyName}", notificationData.companyName),
    };
  },
  [notificationTypeEnum.JOB_APPLICATION_STATUS_CHANGED]: (toBeFormattedMessage, notificationData) => {
    return {
      text: toBeFormattedMessage.replace("{jobName}", notificationData.jobName),
    };
  },
  [notificationTypeEnum.STUDENT_APPLIED_FOR_JOB]: (toBeFormattedMessage, notificationData) => {
    return {
      text: toBeFormattedMessage.replace("{jobName}", notificationData.jobName),
    };
  },
  [notificationTypeEnum.STUDENT_UPLOADED_DOCUMENT]: (toBeFormattedMessage, notificationData) => {
    return {
      text: toBeFormattedMessage,
    };
  },
  [notificationTypeEnum.STUDENT_DOCUMENT_APPROVED_BY_ADMIN]: (toBeFormattedMessage, notificationData) => {
    return {
      text: toBeFormattedMessage.replace("{documentName}", notificationData.documentName),
    };
  },
  [notificationTypeEnum.STUDENT_VERIFICATION]: (toBeFormattedMessage, notificationData) => {
    return {
      text: toBeFormattedMessage,
    };
  },
  [notificationTypeEnum.AFTER_STUDENT_VERIFIED]: (toBeFormattedMessage, notificationData) => {
    return {
      text: toBeFormattedMessage.replace("{studentName}", notificationData.userName),
    };
  },
  [notificationTypeEnum.MENTOR_DECLINES_SESSION]: (toBeFormattedMessage, notificationData) => {
    return {
      text: toBeFormattedMessage.replace("{mentorName}", notificationData.mentorName),
    };
  },
  [notificationTypeEnum.REMIND_MENTEE_TO_REVIEW_MENTOR]: (toBeFormattedMessage, notificationData) => {
    return {
      text: toBeFormattedMessage.replace("{mentorName}", notificationData.mentorName),
    };
  },
  [notificationTypeEnum.STUDENT_APPLIES_FOR_JOB]: (toBeFormattedMessage, notificationData) => {
    return {
      text: toBeFormattedMessage.replace("{studentName}", notificationData.studentName).replace("{jobName}", notificationData.jobName),
    };
  },
  [notificationTypeEnum.COMPANY_WAITS_FOR_APPROVAL_FROM_ADMIN_AFTER_PROFILE_UPDATE]: (toBeFormattedMessage, notificationData) => {
    return {
      text: toBeFormattedMessage,
    };
  },
  [notificationTypeEnum.COMPANY_SIGN_UP]: (toBeFormattedMessage, notificationData) => {
    return {
      text: toBeFormattedMessage,
    };
  },
  [notificationTypeEnum.COMPANY_VERIFICATION]: (toBeFormattedMessage, notificationData) => {
    return {
      text: toBeFormattedMessage,
    };
  },
  [notificationTypeEnum.COMPANY_UPDATED_JOB_POST]: (toBeFormattedMessage, notificationData) => {
    return {
      text: toBeFormattedMessage.replace("{jobName}", notificationData.jobName),
    };
  },
  [notificationTypeEnum.COMPANY_POSTED_JOB]: (toBeFormattedMessage, notificationData) => {
    return {
      text: toBeFormattedMessage.replace("{jobName}", notificationData.jobName),
    };
  },
  [notificationTypeEnum.JOB_APPROVED_BY_ADMIN]: (toBeFormattedMessage, notificationData) => {
    return {
      text: toBeFormattedMessage.replace("{jobName}", notificationData.jobName),
    };
  },
  [notificationTypeEnum.COMPANY_APPROVED_BY_ADMIN]: (toBeFormattedMessage, notificationData) => {
    return {
      text: toBeFormattedMessage,
    };
  },
  [notificationTypeEnum.INSTITUTION_SIGN_UP]: (toBeFormattedMessage, notificationData) => {
    return {
      text: toBeFormattedMessage.replace("{currentYear}", notificationData.currentYear)
    };
  },
  [notificationTypeEnum.INSTITUTION_APPROVED_BY_ADMIN]: (toBeFormattedMessage, notificationData) => {
    return {
      text: toBeFormattedMessage,
    };
  },
  [notificationTypeEnum.INSTITUTION_WAITS_FOR_APPROVAL_FROM_ADMIN_AFTER_PROFILE_UPDATE]: (toBeFormattedMessage, notificationData) => {
    return {
      text: toBeFormattedMessage,
    };
  },
  [notificationTypeEnum.INFO_ABOUT_SESSION]: (toBeFormattedMessage, notificationData) => {
    return {
      text: toBeFormattedMessage,
    };
  },
  [notificationTypeEnum.MENTOR_APPROVES_SESSION_FOR_STUDENT]: (toBeFormattedMessage, notificationData) => {
    return {
      text: toBeFormattedMessage.replace("{mentorName}", notificationData.mentorName),
    };
  },
  [notificationTypeEnum.REVIEW_IS_APPROVED_BY_ADMIN_FOR_STUDENT]: (toBeFormattedMessage, notificationData) => {
    return {
      text: toBeFormattedMessage.replace("{companyName}", notificationData.companyName),
    };
  },
};

async function createUserNotificationsUseCase(notificationTypeKind, userId, notificationData, notificationLink) {
  //get the user's notifications settings
  const user = await userRepo.findById(userId);
  //get notification type message from notification type model
  const notificationTypeData = await notificationTypeRepo.findByNotificationTypeKind(notificationTypeKind);
  if (!notificationTypeData) throw new Error("Invalid notification type");

  // gets user's notification object
  let userNotification = await userNotificationsRepo.findByUserId(userId);
  // create a user notification object if it's not existing
  if (!userNotification) {
    const newUserNotification = makeUserNotifications({ user: userId });
    userNotification = await userNotificationsRepo.insert(newUserNotification);
  }

  if (userNotification?.notifications?.length >= 30) {
    userNotification?.notifications?.shift();
  }

  // checks if the notification is mandatory and the notification type data includes the user's model
  if (notificationTypeData.isMandatory && notificationTypeData.models.includes(user.model)) {
    // checks the class of the notification type and send the notification based on it
    if (notificationTypeData.class == notificationTypeClassEnum.INTERNAL) {
      // pushes the notification to the user's notifications array
      userNotification.notifications.push({
        ...notificationTypeMessageFormatter[notificationTypeData.kind](notificationTypeData.message, notificationData),
        status: notificationStatusEnum.UNREAD,
      });
      // save notifications in DB
      await userNotificationsRepo.updateById(userNotification._id, userNotification);
    } else if (notificationTypeData.class === notificationTypeClassEnum.EXTERNAL) {
      //send external notifications
      await externalNotificationsHandler([user], notificationData, notificationTypeData);
    } else if (notificationTypeData.class === notificationTypeClassEnum.BOTH) {
      //count the notifications array length if its length is 30 so remove the oldest notification and add the new one

      // pushes the notification to the user's notifications array
      userNotification.notifications.push({
        ...notificationTypeMessageFormatter[notificationTypeData.kind](notificationTypeData.message, notificationData),
        status: notificationStatusEnum.UNREAD,
      });
      // save notifications in DB
      await userNotificationsRepo.updateById(userNotification._id, userNotification);
      //send external notifications
      await externalNotificationsHandler([user], notificationData, notificationTypeData);
    }
  } else if (!notificationTypeData.isMandatory) {
    // checks if the user has a notification settings for the notification type
    let userNotificationData = user.notificationSettings.find(
      (notificationSetting) => notificationSetting.notificationType == notificationTypeData.kind
    );
    // if the user has a notification settings for the notification type, it sends the notifications
    if (userNotificationData) {
      // checks the class of the notification type and send the notification based on it
      if (notificationTypeData.class === notificationTypeClassEnum.INTERNAL) {
        // pushes the notification to the user's notifications array
        userNotification.notifications.push({
          ...notificationTypeMessageFormatter[notificationTypeData.kind](notificationTypeData.message, notificationData),
          status: notificationStatusEnum.UNREAD,
        });
        // save notifications in DB
        await userNotificationsRepo.updateById(userNotification._id, userNotification);
      } else if (notificationTypeData.class === notificationTypeClassEnum.EXTERNAL) {
        //send external notifications
        await externalNotificationsHandler([user], notificationData, notificationTypeData);
      } else if (notificationTypeData.class === notificationTypeClassEnum.BOTH) {
        // pushes the notification to the user's notifications array
        userNotification.notifications.push({
          ...notificationTypeMessageFormatter[notificationTypeData.kind](notificationTypeData.message, notificationData),
          status: notificationStatusEnum.UNREAD,
        });
        // save notifications in DB
        await userNotificationsRepo.updateById(userNotification._id, userNotification);
        //send external notifications
        await externalNotificationsHandler([user], notificationData, notificationTypeData);
      }
    }
  }
}

async function getUserNotificationssUseCase(userId, status, paginationQuery) {
  // returning the result as what will the paginator will, in the future update the paginator to be able to handle nested array data inside findOne query
  const userNotifications = await userNotificationsRepo.findByUserId(userId, paginationQuery);

  if (status) {
    userNotifications.notifications = userNotifications.notifications.filter((notification) => notification.status == status); // only double equal to make the comparison only on the value not the type
  }

  // Ensure that userNotifications.notifications contains at most the last 30 notifications
  // if (userNotifications.notifications.length > 30) {
  //   userNotifications.notifications = userNotifications.notifications.slice(-30);
  // }

  userNotifications.notifications = userNotifications.notifications.reverse();

  const allNotificationsLength = userNotifications.notifications.length;

  const queryDataLength = allNotificationsLength;
  const pagesLeft = Math.ceil(queryDataLength / +paginationQuery.pageSize - (+paginationQuery.page + 1));

  // filter by status if there is any
  return {
    queryResult: userNotifications.notifications,
    wholeModelDataCount: allNotificationsLength,
    queryDataLength,
    allNotificationsLength,
    pagesLeft,
    nextPage: pagesLeft > 0,
    hasPrevious: paginationQuery.page > 0,
  };
}
async function getUserNotificationsByIdUseCase(userNotificationsId) {
  return await userNotificationsRepo.findById(userNotificationsId);
}

async function updateUserNotificationsByIdUseCase(userNotificationsId, userNotificationsInfo) {
  return await userNotificationsRepo.updateById(userNotificationsId, userNotificationsInfo);
}

async function updateUserNotificationsStatusUseCase(userId) {
  return await userNotificationsRepo.updateStatusToRead(userId);
}

async function createAdminNotificationsUseCase(notificationTypeKind, userId, notificationData, notificationLink) {
  //get the user's notifications settings
  const user = await adminRepo.findById(userId);

  //get notification type message from notification type model
  const notificationTypeData = await notificationTypeRepo.findByNotificationTypeKind(notificationTypeKind);
  if (!notificationTypeData) throw new Error("Invalid notification type");

  await externalNotificationsHandler([user], notificationData, notificationTypeData);
}

export default {
  createUserNotificationsUseCase,
  getUserNotificationsByIdUseCase,
  getUserNotificationssUseCase,
  updateUserNotificationsByIdUseCase,
  updateUserNotificationsStatusUseCase,
  createAdminNotificationsUseCase,
};
