import educationLevelModel from "../models/educationLevel.model.js";
import paginator from "../../helper/paginator.js";
import studentModel from "../models/student.model.js";
import mentorModel from "../models/mentor.model.js";

async function findAll(paginationQuery) {
  let query = {};
  const queryResult = await paginator(educationLevelModel, query, paginationQuery, [], { order: 1 });

  return queryResult;
}
async function findById(educationalLevelId) {
  return await educationLevelModel.findById(educationalLevelId).lean();
}
async function updateById(educationalLevelId, updatedEducationalLevelInfo) {
  return await educationLevelModel.findByIdAndUpdate(educationalLevelId, updatedEducationalLevelInfo, { new: true, runValidators: true }).lean();
}
async function insert(educationalLevelInfo) {
  const newEducationalLevel = new educationLevelModel(educationalLevelInfo);
  await newEducationalLevel.save();
  return newEducationalLevel;
}
async function removeById(EducationalLevelId) {
  let students = await studentModel.find({ educationLevel: EducationalLevelId }).lean();
  if (students.length > 0) {
    throw new Error("Can't delete this educational level because it's used by students");
  }

  //check if there is any student with this educational level in education

  students = await studentModel.findOne({ "education.educationLevel": EducationalLevelId }).lean();
  if (students) {
    throw new Error("Can't delete this educational level because it's used by students education");
  }

  const mentors = await mentorModel.find({ educationLevel: EducationalLevelId }).lean();
  if (mentors.length > 0) {
    throw new Error("Can't delete this educational level because it's used by mentors");
  }
  await educationLevelModel.deleteOne({ _id: EducationalLevelId });
  return;
}

export default { findAll, insert, findById, updateById, removeById };
