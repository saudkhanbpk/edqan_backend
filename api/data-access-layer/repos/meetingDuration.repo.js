import meetingDurationModel from "../models/meetingDuration.model.js";

async function findAll() {
  return await meetingDurationModel.find().lean();
}
async function findById(meetingDurationId) {
  return await meetingDurationModel.findById(meetingDurationId).lean();
}
async function updateById(meetingDurationId, updatedmeetingDurationInfo) {
  return await meetingDurationModel.findByIdAndUpdate(meetingDurationId, updatedmeetingDurationInfo, { new: true, runValidators: true }).lean();
}
async function insert(meetingDurationInfo) {
  const newMeetingDuration = new meetingDurationModel(meetingDurationInfo);
  await newMeetingDuration.save();
  return newMeetingDuration;
}
async function removeMeetingDurationById(meetingDurationId) {
  await meetingDurationModel.deleteOne({ _id: meetingDurationId });
  return;
}

export default { findAll, insert, findById, updateById, removeMeetingDurationById };
