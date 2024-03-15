import userAttachmentModel from "../models/userAttachment.model.js";
import applicationModel from "../models/application.model.js";

async function findAll() {
  return await userAttachmentModel.find().lean();
}
async function findById(userAttachmentId) {
  return await userAttachmentModel.findById(userAttachmentId).populate({
    path: "user",
    populate: [{ path: "subModel", populate: [{ path: "institution", populate: [{ path: "subModel" }] }] }],
  });
}
async function findByIdWithoutPopulate(userAttachmentId) {
  return await userAttachmentModel.findById(userAttachmentId);
}
async function findByUserId(userId, status, visible, attachmentType) {
  let filterObject = {
    user: userId,
  };
  if (status) filterObject.status = status;
  if (visible) filterObject.visibility = visible;
  if (attachmentType) filterObject.attachmentType = attachmentType;
  return await userAttachmentModel.find(filterObject).populate({
    path: "user",
    populate: [{ path: "subModel", populate: [{ path: "institution", populate: [{ path: "subModel" }] }] }],
  });
}
async function findByIdCount(userId) {
  return await userAttachmentModel.countDocuments({ user: userId }).lean();
}
async function updateById(userAttachmentId, updatedUserAttachmentInfo) {
  return await userAttachmentModel.findByIdAndUpdate(userAttachmentId, updatedUserAttachmentInfo, { new: true, runValidators: true }).populate({
    path: "user",
    populate: [{ path: "subModel", populate: [{ path: "institution", populate: [{ path: "subModel" }] }] }],
  });
}
async function insert(userAttachmentInfo) {
  const newUserAttachment = new userAttachmentModel(userAttachmentInfo);
  await newUserAttachment.save();
  return newUserAttachment;
}
async function removeUserAttachmentById(UserAttachmentId) {
  await userAttachmentModel.deleteOne({ _id: UserAttachmentId });
  return;
}
//make function to check if userAttachmentId is used in application
async function isUserAttachmentIdUsedInApplication(userAttachmentId) {
  let applications = await applicationModel.find({ userAttachment: userAttachmentId }).lean();
  if (applications.length > 0) {
    return true;
  }
  return false;
}
async function findAllFiltered(status, visible, attachmentType) {
  let filterObject = {};
  if (status) filterObject.status = status;
  if (visible) filterObject.visibility = visible;
  if (attachmentType) filterObject.attachmentType = attachmentType;
  return await userAttachmentModel.find(filterObject).populate({
    path: "user",
    populate: [{ path: "subModel", populate: [{ path: "institution", populate: [{ path: "subModel" }] }] }],
  });
}
export default {
  findAll,
  insert,
  findById,
  updateById,
  removeUserAttachmentById,
  findByUserId,
  findByIdCount,
  isUserAttachmentIdUsedInApplication,
  findAllFiltered,
  findByIdWithoutPopulate,
};
