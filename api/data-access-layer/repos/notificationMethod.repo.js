import notificationMethodModel from "../models/notificationMethod.model.js";

async function findAll() {
  return await notificationMethodModel.find().lean().sort({ kind: 1 });
}
async function findById(notificationMethodId) {
  return await notificationMethodModel.findById(notificationMethodId).lean();
}
async function findByKind(kind) {
  return await notificationMethodModel.findOne({ kind }).lean();
}
async function updateById(notificationMethodId, updatedNotificationMethodInfo) {
  return await notificationMethodModel
    .findByIdAndUpdate(notificationMethodId, updatedNotificationMethodInfo, { new: true, runValidators: true })
    .lean();
}
async function insert(notificationMethodInfo) {
  const newNotificationMethod = new notificationMethodModel(notificationMethodInfo);
  await newNotificationMethod.save();
  return newNotificationMethod;
}
async function deleteNotificationMethodById(NotificationMethodId) {
  await notificationMethodModel.deleteOne({ _id: NotificationMethodId });
  return;
}
export default { findAll, insert, findById, updateById, deleteNotificationMethodById, findByKind };
