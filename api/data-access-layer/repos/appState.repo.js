import appStateModel from "../models/appState.model.js";

async function findAll() {
  return await appStateModel.find().lean();
}
async function findById(appStateId) {
  return await appStateModel.findById(appStateId).lean();
}
async function findOne() {
  return await appStateModel.findOne().lean();
}
async function updateById(appStateId, appStateInfo) {
  return await appStateModel.findByIdAndUpdate(appStateId, appStateInfo, { new: true, runValidators: true }).lean();
}
async function insert(appStateInfo) {
  const newAppState = new appStateModel(appStateInfo);
  await newAppState.save();
  return newAppState;
}
export default { findAll, insert, findById, updateById, findOne };
