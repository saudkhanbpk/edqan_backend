import meetingModel from "../models/meeting.model.js";
import paginator from "../../helper/paginator.js";
import { toBoolean } from "../../helper/helper.js";
import studentModel from "../models/student.model.js";

async function findAll(userId, status, session, approved, paginationQuery) {

  const query = {};

  const conditions = [];

  if (userId) {
    conditions.push({
      $or: [{ "user1.user": userId }, { "user2.user": userId }],
    });
  }

  if (status) {
    conditions.push({ "mentorShipSession.status": status });
  }

  session = toBoolean(session);
  if (session) {
    conditions.push({ meetingType: "session" });
  }

  if (approved) {
    conditions.push({ "mentorShipSession.approved": approved });
  }

  // Combine all conditions using $and
  if (conditions.length > 0) {
    query.$and = conditions;
  }
  const queryResult = await paginator(
    meetingModel,
    query,
    paginationQuery,
    [
      "mentorShipSession.mentorShipType",
      "mentorShipSession.preferredLanguage",
      {
        path: "user1.user",
        match: { user1: { $ne: userId } },
        select: "-password  -verified -country -city -notificationSettings -createdAt -updatedAt -__v",
        populate: [{ path: "subModel", select: "firstName middleName lastName id " }],
      },
      {
        path: "user2.user",
        match: { user2: { $ne: userId } },
        select: "-password  -verified -country -city -notificationSettings -createdAt -updatedAt -__v",
        populate: [{ path: "subModel", select: "firstName middleName lastName id " }],
      },
    ],
    { createdAt: -1 }
  );
  return queryResult;
}


async function findAllMeetingsCalendar(userId, paginationQuery) {
  const query = {
    $or: [{ "user1.user": userId }, { "user2.user": userId }],
  };

  const allMeetings = await meetingModel.find(query).populate( [
    "mentorShipSession.mentorShipType",
    "mentorShipSession.preferredLanguage",
    {
      path: "user1.user",
      match: { user1: { $ne: userId } },
      select: "-password  -verified -country -city -notificationSettings -createdAt -updatedAt -__v",
      populate: [{ path: "subModel", select: "firstName middleName lastName id name" }],
    },
    {
      path: "user2.user",
      match: { user2: { $ne: userId } },
      select: "-password  -verified -country -city -notificationSettings -createdAt -updatedAt -__v",
      populate: [{ path: "subModel", select: "firstName middleName lastName id name" }],
    },
  ],);

  // Apply filtering based on meetingType and status
  const filteredMeetings = allMeetings.filter((meeting) => {
    if (meeting.meetingType === "session") {
      return meeting.mentorShipSession.status === "ongoing" && meeting.mentorShipSession.approved === "approved";
    }
    return meeting?.status === "ongoing";
  });


  
  // Create an array of modified meetings
  const meetingsWithModifiedUsers = filteredMeetings.map((meeting) => {
    const modifiedMeeting = { ...meeting.toObject() }; // Create a copy of the original meeting object

    if (meeting.user1.user?.equals(userId)) {
      modifiedMeeting.current_user = modifiedMeeting.user1;
      delete modifiedMeeting.user1;
      modifiedMeeting.other_user = modifiedMeeting.user2;
      delete modifiedMeeting.user2;
    } else if (meeting.user2.user?.equals(userId)) {
      modifiedMeeting.current_user = modifiedMeeting.user2;
      delete modifiedMeeting.user2;
      modifiedMeeting.other_user = modifiedMeeting.user1;
      delete modifiedMeeting.user1;
    }

    return modifiedMeeting;
  });




  // paginate the filteredMeetings
  const allMeetingsLength = meetingsWithModifiedUsers.length;

  const queryDataLength = allMeetingsLength;
  const pagesLeft = Math.ceil(queryDataLength / +paginationQuery.pageSize - (+paginationQuery.page + 1));

  // filter by status if there is any
  return {
    queryResult: meetingsWithModifiedUsers,
    wholeModelDataCount: allMeetingsLength,
    queryDataLength,
    allMeetingsLength,
    pagesLeft,
    nextPage: pagesLeft > 0,
    hasPrevious: paginationQuery.page > 0,
  };
 
}


async function findPendingRequests(mentorId, paginationQuery) {
  let query = {};
  query = {
    $and: [{ "user2.user": mentorId }, { "mentorShipSession.approved": "approved" }, { "mentorShipSession.status": "pending" }],
  };
  const queryResult = await paginator(
    meetingModel,
    query,
    paginationQuery,
    [
      "mentorShipSession.mentorShipType",
      "mentorShipSession.preferredLanguage",
      {
        path: "user1.user",
        select: "-email -password  -verified -country -city -notificationSettings -createdAt -updatedAt -__v",

        populate: [{ path: "subModel", select: "firstName middleName lastName id " }],
      },
    ],
    []
  );
  return queryResult;
}
async function findByMentor(mentorId) {
  return await meetingModel
    .find({
      $and: [{ "user2.user": mentorId }, { menteeRating: { $exists: true } }, { "mentorShipSession.approved": "approved" }],
    })
    .populate("mentorShipSession.mentorShipType")
    .populate("user1.user")
    .populate("user2.user")
    .populate({
      path: "user1.user",
      populate: [{ path: "subModel" }],
    })
    .populate("mentorShipSession.preferredLanguage")

    .lean();
}
async function findByMentorCompletedSessions(mentorId) {
  return await meetingModel
    .find({
      $and: [
        { "user2.user": mentorId },
        { "mentorShipSession.status": "completed" },
        { "mentorShipSession.approved": "approved" },
        { "mentorShipSession.menteeRating": { $exists: true } },
      ],
    })
    .populate("mentorShipSession.mentorShipType")
    .populate("user1.user")
    .populate("user2.user")
    .populate({
      path: "user1.user",
      populate: [{ path: "subModel" }],
    })
    .populate("mentorShipSession.preferredLanguage")

    .lean();
}
//copilot make populate for
async function findById(meetingId) {
  return await meetingModel
    .findById(meetingId)
    .populate("mentorShipSession.mentorShipType")
    .populate("user1.user")
    .populate("user2.user")
    .populate({
      path: "user1.user",
      populate: [{ path: "subModel" }],
    })
    .populate({
      path: "user2.user",
      populate: [{ path: "subModel" }],
    })
    .populate("mentorShipSession.preferredLanguage")
    .lean();
}
async function findByIdWithoutPopulate(meetingId) {
  return await meetingModel.findById(meetingId).lean();
}
async function findByStudent(studentId, status, paginationQuery) {
  let query = {};

  // Build the base query to filter by studentId
  query["user1.user"] = studentId;

  // Add status condition if provided
  if (status) {
    query["mentorShipSession.status"] = status;
  }

  const queryResult = await paginator(
    meetingModel, // Assuming meetingModel is defined
    query,
    paginationQuery,
    [
      "mentorShipSession.mentorShipType",
      "mentorShipSession.preferredLanguage",
      {
        path: "user2.user",
        select: "-email -password -verified -country -city -notificationSettings -createdAt -updatedAt -__v",
        populate: [{ path: "subModel", select: "firstName middleName lastName id" }],
      },
    ],
    { date: -1 }
  );
  return queryResult;
}

async function updateById(meetingId, updatedMeetingInfo) {
  return await meetingModel
    .findByIdAndUpdate(meetingId, updatedMeetingInfo, {
      new: true,
      runValidators: true,
    })
    .lean();
}
async function insert(meetingInfo) {
  const newMeeting = new meetingModel(meetingInfo);
  await newMeeting.save();
  return newMeeting;
}
async function removeMeetingById(meetingId) {
  await meetingModel.deleteOne({ _id: meetingId });
  return;
}
//dashboard analytics
//make function to return count user1 where model is student and user2 model is mentor where meetingType is session
async function findMentorshipSessionByMentor() {
  let query = { meetingType: "session" };

  return await meetingModel.find(query).countDocuments();
}
//make function to return all user1 where model is student and user2 model is mentor where meetingType is session and status completed in given date range
async function findMentorshipSessionByMentorAndDate(mentorId, startDate, endDate, status) {
  const query = {
    $and: [
      { "user2.user": mentorId },
      { meetingType: "session" },
      { "mentorShipSession.approved": 'approved' },
      {
        createdAt: {
          $gte: new Date(startDate).toISOString(),
          $lte: new Date(endDate).toISOString(),
        },
      },
    ],
  };

  if (status !== undefined) {
    query.$and.push({ "mentorShipSession.status": status });
  }

  return await meetingModel.find(query).countDocuments();
}
async function findMentorshipSessionCompleted() {
  return await meetingModel
    .find({
      $and: [{ meetingType: "session" }, { "mentorShipSession.status": "completed" }],
    })
    .countDocuments();
}

// make function to return all user1  by institution id where model is student and where meetingType is session and status completed 
async function findMentorshipSessionByInstitution(institutionId, paginationQuery) {
  const students = await studentModel.find({ institution: institutionId }).lean();
  const usersIds = students.map((student) => student.user);
  const queryResult = await paginator(
    meetingModel,
    { "user1.user": { $in: usersIds }, meetingType: "session", "mentorShipSession.status": "completed" },
    paginationQuery,
    [
      "mentorShipSession.mentorShipType",
      "mentorShipSession.preferredLanguage",
      {
        path: "user2.user",
        select: "-email -password  -verified -country -city -notificationSettings -createdAt -updatedAt -__v",

        populate: [{ path: "subModel", select: "firstName middleName lastName id " }],
      },
      {
        path: "user1.user",
        select: "-email -password  -verified -country -city -notificationSettings -createdAt -updatedAt -__v",

        populate: [{ path: "subModel", select: "firstName middleName lastName id " }],
      }
    ],
    { createdAt: -1 }

  );
  return queryResult;
}

// make function to return all user1  by institution id where model is student and where meetingType is session and status ongoing
async function findMentorshipSessionByInstitutionOngoing(institutionId, paginationQuery) {
  const students = await studentModel.find({ institution: institutionId }).lean();
  const usersIds = students.map((student) => student.user);
  const queryResult = await paginator(
    meetingModel,
    { "user1.user": { $in: usersIds }, meetingType: "session", "mentorShipSession.status": "ongoing" },
    paginationQuery,
    [
      "mentorShipSession.mentorShipType",
      "mentorShipSession.preferredLanguage",
      {
        path: "user2.user",
          
        populate: [{ path: "subModel", select: "firstName middleName lastName id " }],
      },
      {
        path: "user1.user",
        select: "-email -password  -verified -country -city -notificationSettings -createdAt -updatedAt -__v",

        populate: [{ path: "subModel", select: "firstName middleName lastName id " }],
      }
    ],
    { createdAt: -1 }

  );
  return queryResult;
}

// make function to return all user2 where model is mentor and where meetingType is session and status ongoing
async function findByMentorOngoingSessions(mentorId, paginationQuery) {
  const queryResult = await paginator(
    meetingModel,
    { "user2.user": mentorId, meetingType: "session", "mentorShipSession.status": "ongoing" },
    paginationQuery,
    [
      "mentorShipSession.mentorShipType",
      "mentorShipSession.preferredLanguage",
      {
        path: "user1.user",
        select: "-email -password  -verified -country -city -notificationSettings -createdAt -updatedAt -__v",

        populate: [{ path: "subModel", select: "firstName middleName lastName id " }],
      },
    ],
    { createdAt: -1 }
  );
  return queryResult;
}

// make function to return all user2 where model is mentor and where meetingType is session 

async function findByMentorSessions(mentorId, paginationQuery) {
  const queryResult = await paginator(
    meetingModel,
    { "user2.user": mentorId, meetingType: "session","mentorShipSession.status": "completed" },
    paginationQuery,
    [
      "mentorShipSession.mentorShipType",
      "mentorShipSession.preferredLanguage",
      {
        path: "user1.user",
        select: "-email -password  -verified -country -city -notificationSettings -createdAt -updatedAt -__v",

        populate: [{ path: "subModel", select: "firstName middleName lastName id " }],
      },
    ],
    { createdAt: -1 }
  );
  return queryResult;
}

async function findByStudentOnGoingSessions(studentId, paginationQuery) {
  const queryResult = await paginator(
    meetingModel,
    { "user1.user": studentId, meetingType: "session", "mentorShipSession.status": "ongoing" },
    paginationQuery,
    [
      "mentorShipSession.mentorShipType",
      "mentorShipSession.preferredLanguage",
      {
        path: "user2.user",
        select: "-email -password  -verified -country -city -notificationSettings -createdAt -updatedAt -__v",

        populate: [{ path: "subModel", select: "firstName middleName lastName id " }],
      },
    ],
    { createdAt: -1 }
  );
  return queryResult;
}



export default {
  findAll,
  insert,
  findById,
  updateById,
  removeMeetingById,
  findByStudent,
  findPendingRequests,
  findByIdWithoutPopulate,
  findByMentor,
  findMentorshipSessionByMentor,
  findMentorshipSessionByMentorAndDate,
  findByMentorCompletedSessions,
  findMentorshipSessionCompleted,
  findMentorshipSessionByInstitution,
  findMentorshipSessionByInstitutionOngoing,
  findByMentorOngoingSessions,
  findByMentorSessions,
  findAllMeetingsCalendar,
  findByStudentOnGoingSessions
};
