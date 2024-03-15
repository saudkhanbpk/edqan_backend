import notificationTypeModel from "../models/notificationType.model.js";

async function findAll() {
  return await notificationTypeModel.find().lean().sort({ kind: 1 });
}
async function findById(notificationTypeId) {
  return await notificationTypeModel.findById(notificationTypeId).lean();
}
async function findByKind(kind) {
  return await notificationTypeModel.findOne({ kind }).lean();
}
async function findByModel(userModel) {
  return await notificationTypeModel.find({ models: { $in: [userModel] }, isMandatory: false }).lean();
}
async function findByNotificationTypeKind(kind) {
  return await notificationTypeModel.findOne({ kind }).lean();

}
async function updateById(notificationTypeId, updatedNotificationTypeInfo) {
  return await notificationTypeModel.findByIdAndUpdate(notificationTypeId, updatedNotificationTypeInfo, { new: true, runValidators: true }).lean();
}
async function insert(notificationTypeInfo) {
  const newNotificationType = new notificationTypeModel(notificationTypeInfo);
  await newNotificationType.save();
  return newNotificationType;
}
async function deleteNotificationTypeById(NotificationTypeId) {
  await notificationTypeModel.deleteOne({ _id: NotificationTypeId });
  return;
}
export default { findAll, insert, findById, updateById, deleteNotificationTypeById, findByNotificationTypeKind, findByKind, findByModel };
