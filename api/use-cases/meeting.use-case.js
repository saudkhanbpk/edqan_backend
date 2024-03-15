import { meetingRepo, userRepo, mentorShipTypeRepo, meetingDurationRepo, mentorRepo, areaInterestRepo } from "../data-access-layer/index.js";
import meetingStatus from "../types/meetingStatus.enum.js";
import { makeMeeting } from "../entities/index.js";
import userUseCase from "./user.use-case.js";
import userNotificationsUseCase from "./userNotifications.use-case.js";
import notificationTypeEnum from "../types/notificationType.enum.js";
import {
  MentorReceiveSessionRequest,
  MentorApprovesSessionForMentor,
  MentorApprovesSessionForStudent,
  InfoAboutSession,
  MentorDeclineSession,
  RemindMentorToReviewMentee,
  RemindMenteeToReviewMentor,
} from "../notificationData/notificationData.js";
import { format } from "date-fns";
import zoomMeeting from "../meeting/meeting.js";
import meetingStatusEnum from "../types/meetingStatus.enum.js";
import meetingDurationModel from "../data-access-layer/models/meetingDuration.model.js";
import messageUseCase from "./message.use-case.js";
import messageStatusEnum from "../types/messageStatus.enum.js";
import areaInterestModel from "../data-access-layer/models/areaInterest.model.js";

async function createMeetingUseCase(userId, meetingInfo) {
  let userNotify = await userRepo.findById(userId);
  userNotify = userNotify._id;
  meetingInfo.user1 = { user: userId };
  if (meetingInfo.meetingType == "session") {
    meetingInfo.mentorShipSession.status = meetingStatus.PENDING;
  } else {
    meetingInfo.status = meetingStatus.ONGOING;
  }
  /**meeting invitation with user names */
  let user1 = await userRepo.findById(userId);
  if (user1.model == "Mentor") throw new Error("Mentor can not create a meeting");

  if (user1.model == "Student") {
    if (meetingInfo.meetingType !== "session") {
      throw new Error("Student can only create session meeting");
    }
  }

  let user2 = await userRepo.findById(meetingInfo.user2.user);
  let User1Name = user1.subModel.hasOwnProperty("firstName") ? user1.subModel.firstName + " " + user1.subModel.lastName : user1.subModel.name;
  let User2Name = user2.subModel.hasOwnProperty("firstName") ? user2.subModel.firstName + " " + user2.subModel.lastName : user2.subModel.name;

  let meetUrl = await zoomMeeting(User1Name, User2Name);
  meetingInfo.user1 = { meetingUrl: meetUrl.user1, user: userId };
  meetingInfo.user2 = { meetingUrl: meetUrl.user2, user: user2._id };
  const newMeeting = await makeMeeting(meetingInfo);

  await meetingRepo.insert(newMeeting);

  //check if the userIdToNotify is the user1 or user2

  let rec;
  if (userNotify.equals(newMeeting.user1.user)) {
    rec = newMeeting.user2.user;
  } else {
    rec = newMeeting.user1.user;
  }

  let modelMessage;
  let receiverMessageName;
  let senderMessageName;
  if (userNotify.equals(newMeeting.user1.user)) {
    receiverMessageName = User2Name;
    senderMessageName = User1Name;
  } else {
    receiverMessageName = User1Name;
    senderMessageName = User2Name;
  }

  if (receiverMessageName === user2.subModel.name || receiverMessageName === user2.subModel.firstName + " " + user2.subModel.lastName) {
    modelMessage = user2.model;
  } else {
    modelMessage = user1.model;
  }

  const dateTimeMEssage = new Date(newMeeting.startTime);
  const DateMessage = new Date(newMeeting.date);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const formattedDate = DateMessage.toLocaleDateString("en-US", options);

  // Convert the date to a human-readable time format
  // const formattedTime = dateTimeMEssage.toLocaleTimeString();
  const formattedTime = format(dateTimeMEssage, "hh:mm a");
  let messageData = `Hello ${receiverMessageName}, Our call is scheduled for ${formattedDate} (GMT) at the time displayed in your calendar here : ${process.env.APPLICATION_URL}calendar date in your calendar adjusting automatically based on your current time zone. Please click on the calendar date to join the meeting at the scheduled time. If you need to cancel the meeting, you can also do so by clicking on the same calendar date. Thank you,  ${senderMessageName}`;
  await messageUseCase.createMessageUseCase(
    {
      message: messageData,
      receiver: rec,
      sender: userNotify,
      status: messageStatusEnum.DELIVERED,
    },
    userNotify
  );

  // sending notification to the mentor if the meeting is a session
  if (meetingInfo.meetingType == "session") {
    // getting the mentorship name
    let mentorShipTypeName = await areaInterestModel.findById(meetingInfo.mentorShipSession.mentorShipType);

    mentorShipTypeName = mentorShipTypeName.nameEn;
    // await userNotificationsUseCase.createUserNotificationsUseCase(
    //   notificationTypeEnum.MENTOR_RECEIVES_SESSION_REQUEST,
    //   user2._id,
    //   new MentorReceiveSessionRequest(User1Name, User2Name, mentorShipTypeName, `${process.env.SERVER_URL}mentor/mentorship-program`)
    // );
  }
}
async function getMeetingsUseCase(userId, query, paginationQuery) {
  return await meetingRepo.findAll(userId, query?.status, query?.session, query?.approved, paginationQuery);
}
async function getMeetingsPendingUseCase(mentorId, query) {
  return await meetingRepo.findPendingRequests(mentorId, query);
}
async function getMeetingByIdUseCase(meetingId) {
  return await meetingRepo.findById(meetingId);
}
async function updateMeetingByIdUseCase(meetingId, meetingInfo) {
  let oldSession = await meetingRepo.findByIdWithoutPopulate(meetingId);
  // the populatedSession shouldn't be on another query, should be a single query, to be fixed in the future
  let populatedSession = await meetingRepo.findById(meetingId);
  Object.assign(oldSession.mentorShipSession, meetingInfo.mentorShipSession);
  let toBeUpdatedSession = await makeMeeting(oldSession);
  await meetingRepo.updateById(meetingId, toBeUpdatedSession);
  // sends a notifcation to the mentor
  if (meetingInfo.mentorShipSession.approved) {
    await userNotificationsUseCase.createUserNotificationsUseCase(
      notificationTypeEnum.MENTOR_RECEIVES_SESSION_REQUEST,
      populatedSession.user2.user._id,
      new MentorReceiveSessionRequest(
        `${populatedSession.user1.user.subModel.firstName} ${populatedSession.user1.user.subModel.lastName}`,
        `${populatedSession.user2.user.subModel.firstName} ${populatedSession.user2.user.subModel.lastName}`,
        populatedSession.mentorShipSession.mentorShipType.nameEn,
        `${process.env.APPLICATION_URL}mentor/mentorship-program`
      )
    );
  }
  if (toBeUpdatedSession.mentorShipSession.menteeRating) {
    let mentorRating;

    if (Object.keys(toBeUpdatedSession.mentorShipSession.menteeRating).length > 0) {
      let meeting = await meetingRepo.findByMentorCompletedSessions(oldSession.user2.user);
      let rating = 0;

      for (let i = 0; i < meeting?.length; i++) {
        if (meeting[i].mentorShipSession.menteeRating) rating += meeting[i].mentorShipSession.menteeRating.rate;
      }
      mentorRating = (rating / meeting.length).toFixed(2);
    }
    await userUseCase.updateUserByIdUseCase(oldSession.user2.user, {
      rating: mentorRating,
      model: "Mentor",
    });
  }
  // checks if the status of the session has changed
  if (oldSession?.status != toBeUpdatedSession.status) {
    // getting mentor name
    const mentorName = await userRepo.findById(oldSession.user2.user).then((user) => user.subModel.firstName + " " + user.subModel.lastName);
    // getting student name
    const menteeName = await userRepo.findById(oldSession.user1.user).then((user) => user.subModel.firstName + " " + user.subModel.lastName);
    // sends notification when the mentor approves a session

    let meetingDurationTime = await meetingDurationModel.find();
    meetingDurationTime = meetingDurationTime[0].durationMinutes;
    if (meetingInfo?.mentorShipSession?.status === meetingStatus.ONGOING) {
      // send a notification of notification type MENTOR_APPROVES_SESSION_FOR_MENTOR to the mentor
      await userNotificationsUseCase.createUserNotificationsUseCase(
        notificationTypeEnum.MENTOR_APPROVES_SESSION_FOR_MENTOR,
        oldSession.user2.user,
        new MentorApprovesSessionForMentor(
          mentorName,
          meetingDurationTime,
          menteeName,
          toBeUpdatedSession.startTime,
          format(toBeUpdatedSession.date, "dd/MM/yyyy"),
          toBeUpdatedSession.user2.meetingUrl
        )
      );
      // sends a notification of notification type MENTOR_APPROVES_SESSION_FOR_STUDENT to the student
      await userNotificationsUseCase.createUserNotificationsUseCase(
        notificationTypeEnum.MENTOR_APPROVES_SESSION_FOR_STUDENT,
        oldSession.user2.user,
        new MentorApprovesSessionForStudent(
          mentorName,
          meetingDurationTime,
          menteeName,
          toBeUpdatedSession.startTime,
          format(toBeUpdatedSession.date, "dd/MM/yyyy"),
          toBeUpdatedSession.user1.meetingUrl
        )
      );
      // sends an info about session email to student
      await userNotificationsUseCase.createUserNotificationsUseCase(
        notificationTypeEnum.INFO_ABOUT_SESSION,
        oldSession.user1.user,
        new InfoAboutSession(menteeName, mentorName)
      );
    } else if (meetingInfo?.mentorShipSession?.status === meetingStatus.DECLINED) {
      // getting the mentorship name
      const mentorShipTypeName = await mentorShipTypeRepo
        .findById(meetingInfo.mentorShipSession.mentorShipType)
        .then((mentorShipType) => mentorShipType.nameEn);
      // sends a notification of notification type MENTOR_APPROVES_SESSION_FOR_STUDENT to the student
      await userNotificationsUseCase.createUserNotificationsUseCase(
        notificationTypeEnum.MENTOR_DECLINES_SESSION,
        oldSession.user1.user,
        new MentorDeclineSession(menteeName, mentorName, mentorShipTypeName)
      );
    }
  }
}
async function updateMeetingStatusUseCase(meetingId, meetingInfo, userIdNotify) {
  let oldSession = await meetingRepo.findByIdWithoutPopulate(meetingId);

  if (oldSession.meetingType == "meeting") {
    if (meetingInfo.status !== undefined || meetingInfo.status !== null) {
      await meetingRepo.updateById(meetingId, { status: meetingInfo.status });

      const user1Info = await userRepo.findById(oldSession.user1.user);
      let user1 = user1Info?.subModel?.name || user1Info?.subModel?.firstName;

      const user2Info = await userRepo.findById(oldSession.user2.user);
      let user2 = user2Info?.subModel?.name || user2Info?.subModel?.firstName;
      //check if the userIdToNotify is the user1 or user2
      let rec;
      if (userIdNotify.equals(oldSession.user1.user)) {
        rec = oldSession.user2.user;
      } else {
        rec = oldSession.user1.user;
      }

      let receiverMessageName;
      let senderMessageName;
      if (userIdNotify.equals(oldSession.user1.user)) {
        receiverMessageName = user2;
        senderMessageName = user1;
      } else {
        receiverMessageName = user1;
        senderMessageName = user2;
      }
      let modelMessage;
      //check if receiver is user2Info.subModel.name or user2Info.subModel.firstName and sender is user1Info.subModel.name or user1Info.subModel.firstName
      if (receiverMessageName === user2Info.subModel.name || receiverMessageName === user2Info.subModel.firstName) {
        modelMessage = user2Info.model;
      } else {
        modelMessage = user1Info.model;
      }

      const dateTimeMEssage = new Date(oldSession.startTime);

      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };

      const formattedDate = oldSession.date.toLocaleDateString("en-US", options);
      // Convert the date to a human-readable time format
      // const formattedTime = dateTimeMEssage.toLocaleTimeString();
      const formattedTime = format(dateTimeMEssage, "hh:mm a");
      let messageData = `Hello ${receiverMessageName}, Our call is scheduled for  ${formattedDate} (GMT) has been cancelled. Thank you, ${senderMessageName}`;
      await messageUseCase.createMessageUseCase(
        {
          message: messageData,
          receiver: rec,
          sender: userIdNotify,
          status: messageStatusEnum.DELIVERED,
        },
        userIdNotify
      );
    }
  }

  if (oldSession.meetingType == "session") {
    if (!oldSession) throw new Error("meeting not found");
    if (oldSession.mentorShipSession?.status == meetingStatusEnum.COMPLETED) throw new Error("session already completed");
    if (oldSession.mentorShipSession?.status == meetingStatusEnum.ONGOING) {
      if (meetingInfo.status == meetingStatusEnum.PENDING) throw new Error("session already started");
    }
    if (meetingInfo.status == meetingStatusEnum.COMPLETED) meetingInfo.dateOfCompletion = new Date();
    // oldSession = { ...oldSession, ...meetingInfo };
    Object.assign(oldSession?.mentorShipSession, {
      status: meetingInfo.status,
    });
    // delete oldSession.mentorShipSession.endTime
    let toBeUpdatedSession = await makeMeeting(oldSession);

    let mentor = await userRepo.findById(toBeUpdatedSession.user2.user);
    // let mentorAVT = mentor.subModel.availabilityTime.find((availabilityTime) => {
    //   if (format(availabilityTime.date, "yyyy-MM-dd") == format(toBeUpdatedSession.date, "yyyy-MM-dd")) return !!availabilityTime;
    //   else return false;
    // });
    // for (let i = 0; i < mentorAVT?.startTime.length; i++) {
    //   if (mentorAVT.startTime[i] == toBeUpdatedSession.startTime) mentorAVT.startTime.splice(i, 1);
    // }

    // await userRepo.updateById(mentor._id, mentor);

    if (meetingInfo.status === meetingStatusEnum.ONGOING) {
      // let mentor = await userRepo.findById(toBeUpdatedSession.user2.user);

      if (mentor) {
        const mentorAVTimes = mentor.subModel.availabilityTime;
        const mentorInfoDateStr = oldSession.startTime;
        const mentorInfoDate = new Date(mentorInfoDateStr);
        const dateToMatch = mentorInfoDate.toISOString();

        // Find and remove the date that matches startTime
        for (let i = 0; i < mentorAVTimes.length; i++) {
          if (mentorAVTimes[i].toISOString() === dateToMatch) {
            // Remove the date at index i
            mentorAVTimes.splice(i, 1);
            break; // Exit the loop after the first match is removed
          }
        }

        await mentorRepo.updateWithoutPopulate(mentor.subModel._id, {
          availabilityTime: mentorAVTimes,
        });
      }
    }

    await meetingRepo.updateById(meetingId, toBeUpdatedSession);

    // getting mentor name
    const mentorName = await userRepo.findById(oldSession.user2.user).then((user) => user.subModel.firstName + " " + user.subModel.lastName);
    // getting student name
    const menteeName = await userRepo.findById(oldSession.user1.user).then((user) => user.subModel.firstName + " " + user.subModel.lastName);
    // sends notification when the mentor approves a session

    let meetingDurationTime = await meetingDurationModel.find();
    meetingDurationTime = meetingDurationTime[0].durationMinutes;

    if (meetingInfo?.status === meetingStatus.ONGOING) {
      const dateTimeMEssage = new Date(toBeUpdatedSession.startTime);

      const mentorShipTypeName = await areaInterestRepo
        .findById(toBeUpdatedSession.mentorShipSession.mentorShipType)
        .then((mentorShipType) => mentorShipType.nameEn);

      // Convert the date to a human-readable time format
      // const formattedTime = dateTimeMEssage.toLocaleTimeString();

      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };

      const formattedDate = oldSession.date.toLocaleDateString("en-US", options);
      let messageData = `Hello ${menteeName},  Our mentorship session for ${mentorShipTypeName} on ${formattedDate} (GMT) has been Approved. The time is set in your calendar here :  ${process.env.APPLICATION_URL}calendar , adjusting automatically based on your current time zone. Simply click on the calendar date to join the meeting at the scheduled time. If you need to cancel the meeting, you can do so by clicking on the same calendar date. 
      Thank you, ${mentorName}`;

      await messageUseCase.createMessageUseCase(
        {
          message: messageData,
          receiver: oldSession.user1.user,
          sender: oldSession.user2.user,
          status: messageStatusEnum.DELIVERED,
        },
        oldSession.user2.user
      );
      // send a notification of notification type MENTOR_APPROVES_SESSION_FOR_MENTOR to the mentor
      await userNotificationsUseCase.createUserNotificationsUseCase(
        notificationTypeEnum.MENTOR_APPROVES_SESSION_FOR_MENTOR,
        oldSession.user2.user,
        new MentorApprovesSessionForMentor(
          mentorName,
          meetingDurationTime,
          menteeName,
          toBeUpdatedSession.startTime,
          format(toBeUpdatedSession.date, "dd/MM/yyyy"),
          toBeUpdatedSession.user2.meetingUrl
        )
      );
      // sends a notification of notification type MENTOR_APPROVES_SESSION_FOR_STUDENT to the student
      await userNotificationsUseCase.createUserNotificationsUseCase(
        notificationTypeEnum.MENTOR_APPROVES_SESSION_FOR_STUDENT,
        oldSession.user2.user,
        new MentorApprovesSessionForStudent(
          mentorName,
          meetingDurationTime,
          menteeName,
          toBeUpdatedSession.startTime,
          format(toBeUpdatedSession.date, "dd/MM/yyyy"),
          toBeUpdatedSession.user1.meetingUrl
        )
      );
      // sends an info about session email to student
      await userNotificationsUseCase.createUserNotificationsUseCase(
        notificationTypeEnum.INFO_ABOUT_SESSION,
        oldSession.user1.user,
        new InfoAboutSession(menteeName, mentorName)
      );
    } else if (meetingInfo?.status === meetingStatus.DECLINED) {
      // getting the mentorship name
      const mentorShipTypeName = await areaInterestRepo
        .findById(toBeUpdatedSession.mentorShipSession.mentorShipType)
        .then((mentorShipType) => mentorShipType.nameEn);
      // sends a notification of notification type MENTOR_APPROVES_SESSION_FOR_STUDENT to the student
      await userNotificationsUseCase.createUserNotificationsUseCase(
        notificationTypeEnum.MENTOR_DECLINES_SESSION,
        oldSession.user1.user,
        new MentorDeclineSession(menteeName, mentorName, mentorShipTypeName)
      );
    }

    if (meetingInfo.status == meetingStatusEnum.COMPLETED) {
      // gets the mentor name
      const mentorName =
        String(mentor.subModel.firstName).charAt(0).toUpperCase() +
        mentor.subModel.firstName.slice(1) +
        " " +
        String(mentor.subModel.lastName).charAt(0).toUpperCase() +
        mentor.subModel.lastName.slice(1);
      // gets the student name
      const menteeName = await userRepo
        .findById(toBeUpdatedSession.user1.user)
        .then((user) => user.subModel.firstName + " " + user.subModel.lastName);
      // send a notification of notification type REMIND_MENTOR_TO_REVIEW_MENTEE to the mentor
      await userNotificationsUseCase.createUserNotificationsUseCase(
        notificationTypeEnum.REMIND_MENTOR_TO_REVIEW_MENTEE,
        toBeUpdatedSession.user2.user,
        new RemindMentorToReviewMentee(mentorName, menteeName, `${process.env.APPLICATION_URL}mentor/mentor-rating/${meetingId}`)
      );
      // send a notification of notification type REMIND_MENTEE_TO_REVIEW_MENTOR to the student
      await userNotificationsUseCase.createUserNotificationsUseCase(
        notificationTypeEnum.REMIND_MENTEE_TO_REVIEW_MENTOR,
        toBeUpdatedSession.user1.user,
        new RemindMenteeToReviewMentor(mentorName, menteeName, `${process.env.APPLICATION_URL}professionals/mentor-rating/${meetingId}`)
      );
    } else if (meetingInfo.status == meetingStatusEnum.DECLINED) {
      const mentorName = mentor.subModel.firstName + " " + mentor.subModel.lastName;
      // gets the student name
      const menteeName = await userRepo
        .findById(toBeUpdatedSession.user1.user)
        .then((user) => user.subModel.firstName + " " + user.subModel.lastName);
      let receiverMessageName;
      let senderMessageName;

      if (userIdNotify.equals(oldSession.user1.user)) {
        receiverMessageName = mentorName;
        senderMessageName = menteeName;
      } else {
        receiverMessageName = menteeName;
        senderMessageName = mentorName;
      }

      const dateTimeMEssage = new Date(toBeUpdatedSession.startTime);
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };

      const formattedDate = oldSession.date.toLocaleDateString("en-US", options);
      // Convert the date to a human-readable time format
      // const formattedTime = dateTimeMEssage.toLocaleTimeString();
      const formattedTime = format(dateTimeMEssage, "hh:mm a");
      let messageData;
      if (userIdNotify.equals(oldSession.user1.user)) {
        messageData = `Hello ${receiverMessageName}, Our call is scheduled for ${formattedDate}(GMT) has been cancelled. Thank you, ${senderMessageName}`;
      } else {
        const mentorShipTypeName = await areaInterestRepo
          .findById(toBeUpdatedSession.mentorShipSession.mentorShipType)
          .then((mentorShipType) => mentorShipType.nameEn);

        messageData = `Hello ${receiverMessageName}, It will not be possible to proceed with the mentorship session for ${mentorShipTypeName} on ${formattedDate} (GMT) I appreciate your understanding. Thank you, ${senderMessageName}`;
      }

      let rec;
      if (userIdNotify.equals(oldSession.user1.user)) {
        rec = oldSession.user2.user;
      } else {
        rec = oldSession.user1.user;
      }
      await messageUseCase.createMessageUseCase(
        {
          message: messageData,
          receiver: rec,
          sender: userIdNotify,
          status: messageStatusEnum.DELIVERED,
        },
        userIdNotify
      );
    }
  }
}
async function getAllSessionCompletedUseCase() {
  let sessions = await meetingRepo.findMentorshipSessionCompleted();
  return sessions;
}

async function findAllMeetingsCalendarUseCase(userId, paginationQuery) {
  let meetings = await meetingRepo.findAllMeetingsCalendar(userId, paginationQuery);
  return meetings;
}

export default {
  createMeetingUseCase,
  getMeetingsUseCase,
  getMeetingByIdUseCase,
  updateMeetingByIdUseCase,
  updateMeetingStatusUseCase,
  getAllSessionCompletedUseCase,
  getMeetingsUseCase,
  getMeetingsPendingUseCase,
  findAllMeetingsCalendarUseCase,
};
