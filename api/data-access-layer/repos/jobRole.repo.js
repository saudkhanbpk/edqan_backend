import paginator from "../../helper/paginator.js";
import studentModel from "../models/student.model.js";
import jobRoleModel from "../models/jobRole.model.js";

async function findAll(paginationQuery) {
  let query = {};
  const queryResult = await paginator(jobRoleModel, query, paginationQuery, [], { order: 1 });

  return queryResult;
}
async function findById(jobRoleId) {
  return await jobRoleModel.findById(jobRoleId).lean();
}
async function updateById(jobRoleId, updatedJobRoleInfo) {
  return await jobRoleModel.findByIdAndUpdate(jobRoleId, updatedJobRoleInfo, { new: true, runValidators: true }).lean();
}
async function insert(jobRoleInfo) {
  const newJobRole = new jobRoleModel(jobRoleInfo);
  await newJobRole.save();
  return newJobRole;
}
async function removeJobRoleById(JobRoleId) {
  //check if job role is used in student model career interest job role
  const student = await studentModel.findOne({ "careerInterest.jobRole": JobRoleId });
  if (student) {
    throw new Error("Job role is used in student career interest");
  }
  await jobRoleModel.deleteOne({ _id: JobRoleId });
  return;
}
export default { findAll, insert, findById, updateById, removeJobRoleById };
