import paginator from "../../helper/paginator.js";
import studentModel from "../models/student.model.js";
import majorModel from "../models/major.model.js";
import mentorModel from "../models/mentor.model.js";
import jobModel from "../models/job.model.js";

async function findAll(paginationQuery) {
  let query = {};
  const queryResult = await paginator(majorModel, query, paginationQuery, [], { order: 1 });
  return queryResult;
}
async function findById(majorId) {
  return await majorModel.findById(majorId).lean();
}
async function updateById(majorId, updatedMajorInfo) {
  return await majorModel
    .findByIdAndUpdate(majorId, updatedMajorInfo, {
      new: true,
      runValidators: true,
    })
    .lean();
}
async function insert(majorInfo) {
  const newMajor = new majorModel(majorInfo);
  await newMajor.save();
  return newMajor;
}
async function removeMajorById(MajorId) {
  let students = await studentModel.find({ major: MajorId }).lean();
  if (students.length > 0) {
    throw new Error("Can't delete this major because it's used by students");
  }

  //check if student jobMajors includes majorId
  students = await studentModel.find({ jobMajors: MajorId }).lean();
  if (students.length > 0) {
    throw new Error("Can't delete this major because it's used by students");
  }
  students = await studentModel.find({ "education.major": MajorId }).lean();
  if (students.length > 0) {
    throw new Error("Can't delete this major because it's used by students");
  }

  let mentors = await mentorModel.find({ major: MajorId }).lean();
  if (mentors.length > 0) {
    throw new Error("Can't delete this major because it's used by mentors");
  }

  mentors = await mentorModel.find({ majors: MajorId }).lean();
  if (mentors.length > 0) {
    throw new Error("Can't delete this major because it's used by mentors");
  }

  let jobs = await jobModel.find({ major: MajorId }).lean();
  if (jobs.length > 0) {
    throw new Error("Can't delete this major because it's used by jobs");
  }

  await majorModel.deleteOne({ _id: MajorId });
  return;
}
export default { findAll, insert, findById, updateById, removeMajorById };
