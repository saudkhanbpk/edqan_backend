import userNotificationsModel from "../models/userNotification.model.js";

async function findAll() {
  return await userNotificationsModel.find().lean();
}
async function findById(userNotificationsId) {
  return await userNotificationsModel.findById(userNotificationsId).lean();
}
async function findByUserId(userId) {
  return userNotificationsModel.findOne({ user: userId }).lean();
}
async function updateStatusToRead(userId) {
  let userNotifications = await userNotificationsModel.findOne({ user: userId }).lean();
  for (let i = 0; i < userNotifications.notifications.length; i++) {
    userNotifications.notifications[i].status = 1;
  }
  await userNotificationsModel.updateOne({ user: userId }, userNotifications);
}
async function updateById(userNotificationsId, updatedUserNotificationsInfo) {
  return await userNotificationsModel.findByIdAndUpdate(userNotificationsId, updatedUserNotificationsInfo, { new: true, runValidators: true }).lean();
}
async function insert(userNotificationsInfo) {
  const newUserNotifications = new userNotificationsModel(userNotificationsInfo);
  await newUserNotifications.save();
  return newUserNotifications;
}
async function removeUserNotificationsById(UserNotificationsId) {
  await userNotificationsModel.deleteOne({ _id: UserNotificationsId });
  return;
}

export default { findAll, insert, findById, findByUserId, updateById, removeUserNotificationsById, updateStatusToRead };
