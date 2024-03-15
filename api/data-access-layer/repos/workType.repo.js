import workTypeModel from "../models/workType.model.js";
import paginator from "../../helper/paginator.js";
import jobModel from "../models/job.model.js";

async function findAll(paginationQuery) {
  let query = {};
  const queryResult = await paginator(workTypeModel, query, paginationQuery, [], { order: 1 });

  return queryResult;
}
async function findById(workTypeId) {
  return await workTypeModel.findById(workTypeId).lean();
}
async function updateById(workTypeId, updatedWorkTypeInfo) {
  return await workTypeModel
    .findByIdAndUpdate(workTypeId, updatedWorkTypeInfo, {
      new: true,
      runValidators: true,
    })
    .lean();
}
async function insert(workTypeInfo) {
  const newWorkType = new workTypeModel(workTypeInfo);
  await newWorkType.save();
  return newWorkType;
}
async function removeWorkTypeById(WorkTypeId) {
  let jobs = await jobModel.find({ workType: WorkTypeId }).lean();
  if (jobs.length > 0) {
    throw new Error("Can't delete this workType because it's used by jobs");
  }

  await workTypeModel.deleteOne({ _id: WorkTypeId });
  return;
}

export default { findAll, insert, findById, updateById, removeWorkTypeById };
