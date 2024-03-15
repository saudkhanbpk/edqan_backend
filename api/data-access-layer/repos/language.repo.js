import languageModel from "../models/language.model.js";
import studentModel from "../models/student.model.js";
import mentorModel from "../models/mentor.model.js";
import paginator from "../../helper/paginator.js";
import jobModel from "../models/job.model.js";
import meetingModel from "../models/meeting.model.js";

async function findAll(paginationQuery) {
  let query = {};
  const queryResult = await paginator(languageModel, query, paginationQuery, [], { order: 1 });
  return queryResult;
}
async function findById(languageId) {
  return await languageModel.findById(languageId).lean();
}
async function updateById(languageId, updatedLanguageInfo) {
  return await languageModel
    .findByIdAndUpdate(languageId, updatedLanguageInfo, {
      new: true,
      runValidators: true,
    })
    .lean();
}
async function insert(languageInfo) {
  const newLanguage = new languageModel(languageInfo);
  await newLanguage.save();
  return newLanguage;
}
async function removeLanguageById(LanguageId) {
  //check if student model fluentLanguage proficientLanguage includes languageId
  let students = await studentModel
    .find({
      $or: [{ fluentLanguage: LanguageId }, { proficientLanguage: LanguageId }],
    })
    .lean();

  if (students.length > 0) {
    throw new Error("Can't delete this language because it's used by students");
  }

  //check if meeting model mentorShipSession.preferredLanguage includes languageId
  let meetings = await meetingModel.find({
    "mentorShipSession.preferredLanguage": LanguageId,
  });
  if (meetings.length > 0) {
    throw new Error("Can't delete this language because it's used by meetings");
  }

  //check if job model jobPreference fluentLanguage includes languageId

  let jobs = await jobModel.find({
    "jobPreference.fluentLanguage": LanguageId,
  });
  if (jobs.length > 0) {
    throw new Error("Can't delete this language because it's used by jobs");
  }
  //check if mentor model mentoringLanguages includes languageId

  let mentors = await mentorModel.find({
    mentoringLanguages: LanguageId,
  });
  if (mentors.length > 0) {
    throw new Error("Can't delete this language because it's used by mentors");
  }

  await languageModel.deleteOne({ _id: LanguageId });
  return;
}

export default { findAll, insert, findById, updateById, removeLanguageById };
