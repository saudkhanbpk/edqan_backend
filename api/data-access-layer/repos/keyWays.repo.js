import keyWaysModel from "../models/keyWays.model.js";
import reviewModel from "../models/review.model.js";

async function findAll() {
  return await keyWaysModel.find().lean();
}
async function findById(keyWaysId) {
  return await keyWaysModel.findById(keyWaysId).lean();
}
async function updateById(keyWaysId, updatedKeyWaysInfo) {
  return await keyWaysModel.findByIdAndUpdate(keyWaysId, updatedKeyWaysInfo, { new: true, runValidators: true }).lean();
}
async function insert(keyWaysInfo) {
  const newKeyWays = new keyWaysModel(keyWaysInfo);
  await newKeyWays.save();
  return newKeyWays;
}
async function removeKeyWaysById(KeyWaysId) {
  //check if key ways is used in review model key ways array
  const review = await reviewModel.findOne({ keyWays: KeyWaysId });
  if (review) {
    throw new Error("Key ways is used in reviews");
  }

  await keyWaysModel.deleteOne({ _id: KeyWaysId });
  return;
}
export default { findAll, insert, findById, updateById, removeKeyWaysById };
