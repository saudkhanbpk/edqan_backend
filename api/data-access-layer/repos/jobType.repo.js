import jobTypeModel from "../models/jobType.model.js";
import paginator from "../../helper/paginator.js";
import jobModel from "../models/job.model.js";

async function findAll(paginationQuery) {
  let query = {};
  const queryResult = await paginator(jobTypeModel, query, paginationQuery, [], { order: 1 });

  return queryResult;
}
async function findById(jobTypeId) {
  return await jobTypeModel.findById(jobTypeId).lean();
}
async function updateById(jobTypeId, updatedJobTypeInfo) {
  return await jobTypeModel.findByIdAndUpdate(jobTypeId, updatedJobTypeInfo, { new: true, runValidators: true }).lean();
}
async function insert(jobTypeInfo) {
  const newJobType = new jobTypeModel(jobTypeInfo);
  await newJobType.save();
  return newJobType;
}
async function removeJobTypeById(JobTypeId) {
  //check if job type is used in job model
  const job = await jobModel.findOne({ jobType: JobTypeId });
  if (job) {
    throw new Error("Job type is used in job");
  }
  await jobTypeModel.deleteOne({ _id: JobTypeId });
  return;
}
export default { findAll, insert, findById, updateById, removeJobTypeById };
