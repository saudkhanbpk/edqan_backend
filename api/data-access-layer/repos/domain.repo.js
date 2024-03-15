import domainModel from "../models/subModels/domain.model.js";

async function findAll() {
  return await domainModel.find().lean();
}
async function findById(domainId) {
  return await domainModel.findById(domainId).lean();
}
async function findByName(name) {
  return await domainModel.find({ name: { $regex: name, $options: "i" } }).lean();
}
async function updateById(domainId, updatedDomainInfo) {
  return await domainModel.findByIdAndUpdate(domainId, updatedDomainInfo, { new: true, runValidators: true }).lean();
}
async function insert(domainInfo) {
  const newDomain = new domainModel(domainInfo);
  await newDomain.save();
  return newDomain;
}
async function deleteDomainById(DomainId) {
  await domainModel.deleteOne({ _id: DomainId });
  return;
}

export default { findAll, insert, findById, findByName, updateById, deleteDomainById };
