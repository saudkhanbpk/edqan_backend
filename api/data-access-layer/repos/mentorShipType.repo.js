import mentorShipTypeModel from "../models/mentorShipType.model.js";
import meetingModel from "../models/meeting.model.js";

async function findAll() {
  return await mentorShipTypeModel.find().lean();
}
async function findById(mentorShipTypeId) {
  return await mentorShipTypeModel.findById(mentorShipTypeId).lean();
}
async function updateById(mentorShipTypeId, updatedMentorShipTypeInfo) {
  return await mentorShipTypeModel.findByIdAndUpdate(mentorShipTypeId, updatedMentorShipTypeInfo, { new: true, runValidators: true }).lean();
}
async function insert(mentorShipTypeInfo) {
  const newMentorShipType = new mentorShipTypeModel(mentorShipTypeInfo);
  await newMentorShipType.save();
  return newMentorShipType;
}
async function removeMentorShipTypeById(MentorShipTypeId) {
  //check if meeting model mentorShipSession.preferredLanguage includes languageId
  let meetings = await meetingModel.find({ mentorShipType: MentorShipTypeId }).lean();
  if (meetings.length > 0) {
    throw new Error("Can't delete this mentorShipType because it's used by meetings");
  }
  meetings = await meetingModel.find({ "mentorShipSession.mentorShipType": MentorShipTypeId }).lean();
  if (meetings.length > 0) {
    throw new Error("Can't delete this mentorShipType because it's used by meetings");
  }

  await mentorShipTypeModel.deleteOne({ _id: MentorShipTypeId });
  return;
}
export default { findAll, insert, findById, updateById, removeMentorShipTypeById };
