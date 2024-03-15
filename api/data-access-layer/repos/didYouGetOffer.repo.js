import didYouGetOfferModel from "../models/subModels/didYouGetOffer.model.js";

async function findAll() {
  return await didYouGetOfferModel.find().lean();
}
async function findById(didYouGetOfferId) {
  return await didYouGetOfferModel.findById(didYouGetOfferId).lean();
}
async function findByName(name) {
  return await didYouGetOfferModel.find({ nameEn: { $regex: name, $options: "i" }, nameAR: { $regex: name, $options: "i" } }).lean();
}
async function updateById(didYouGetOfferId, updatedDidYouGetOfferInfo) {
  return await didYouGetOfferModel.findByIdAndUpdate(didYouGetOfferId, updatedDidYouGetOfferInfo, { new: true, runValidators: true }).lean();
}
async function insert(didYouGetOfferInfo) {
  const newDidYouGetOffer = new didYouGetOfferModel(didYouGetOfferInfo);
  await newDidYouGetOffer.save();
  return newDidYouGetOffer;
}
async function deleteDidYouGetOfferById(DidYouGetOfferId) {
  await didYouGetOfferModel.deleteOne({ _id: DidYouGetOfferId });
  return;
}
export default { findAll, insert, findById, updateById, deleteDidYouGetOfferById, findByName };
