import adminModel from "../models/admin.model.js";

async function findAll() {
  return await adminModel.find().lean();
}
async function findByEmail(email) {
  return await adminModel.findOne({ email }).lean();
}
async function findById(adminId) {
  return await adminModel.findById(adminId).lean();
}
async function updateById(adminId, adminInfo) {
  return await adminModel.findByIdAndUpdate(adminId, adminInfo, { new: true, runValidators: true }).lean();
}
async function insert(adminInfo) {
  const newAdmin = new adminModel(adminInfo);
  await newAdmin.save();
  return newAdmin;
}
async function deleteById(adminId) {
  return await adminModel.findByIdAndDelete(adminId).lean();
}
async function updateByEmail(userEmail, updatedUserInfo) {
  return await adminModel
    .findOneAndUpdate({ email: userEmail }, updatedUserInfo, {
      new: true,
      runValidators: true,
    })
    .lean();
}
export default { findAll, insert, findById, updateById, findByEmail, deleteById, updateByEmail };
