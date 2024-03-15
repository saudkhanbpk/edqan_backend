// import reviewOptionsModel from "../models/subModels/";

async function findAll() {
  return await reviewOptionsModel.find().populate("country").lean();
}
async function findById(reviewOptionsId) {
  return await reviewOptionsModel.findById(reviewOptionsId).populate("country").lean();
}
async function updateById(reviewOptionsId, updatedReviewOptionsInfo) {
  return await reviewOptionsModel
    .findByIdAndUpdate(reviewOptionsId, updatedReviewOptionsInfo, { new: true, runValidators: true })
    .populate("country")
    .lean();
}
async function insert(reviewOptionsInfo) {
  const newReviewOptions = new reviewOptionsModel(reviewOptionsInfo);
  await newReviewOptions.save();
  return newReviewOptions;
}
async function removeReviewOptionsById(ReviewOptionsId) {
  await reviewOptionsModel.deleteOne({ _id: ReviewOptionsId });
  return;
}
export default { findAll, insert, findById, updateById, removeReviewOptionsById };
