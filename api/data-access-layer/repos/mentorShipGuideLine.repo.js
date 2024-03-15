import mentorShipGuideLineModel from "../models/mentorShipGuideLine.model.js";

async function findAll() {
  return await mentorShipGuideLineModel.find().lean();
}
async function findById(mentorShipGuideLineId) {
  return await mentorShipGuideLineModel.findById(mentorShipGuideLineId).lean();
}
async function updateById(mentorShipGuideLineId, updatedMentorShipGuideLineInfo) {
  return await mentorShipGuideLineModel
    .findByIdAndUpdate(mentorShipGuideLineId, updatedMentorShipGuideLineInfo, { new: true, runValidators: true })
    .lean();
}
async function insert(mentorShipGuideLineInfo) {
  const newMentorShipGuideLine = new mentorShipGuideLineModel(mentorShipGuideLineInfo);
  await newMentorShipGuideLine.save();
  return newMentorShipGuideLine;
}
async function removeMentorShipGuideLineById(MentorShipGuideLineId) {
  await mentorShipGuideLineModel.deleteOne({ _id: MentorShipGuideLineId });
  return;
}
export default { findAll, insert, findById, updateById, removeMentorShipGuideLineById };
