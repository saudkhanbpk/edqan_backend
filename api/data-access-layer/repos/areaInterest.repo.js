import areaInterestModel from "../models/areaInterest.model.js";
import paginator from "../../helper/paginator.js";
import studentModel from "../models/student.model.js";
import mentorModel from "../models/mentor.model.js";

async function findAll(paginationQuery) {
  let query = {};
  const queryResult = await paginator(areaInterestModel, query, paginationQuery, [], { order: 1 });
  return queryResult;
}
async function findById(areaInterestId) {
  return await areaInterestModel
    .findById(areaInterestId)

    .lean();
}
async function updateById(areaInterestId, updatedAreaInterestInfo) {
  return await areaInterestModel
    .findByIdAndUpdate(areaInterestId, updatedAreaInterestInfo, {
      new: true,
      runValidators: true,
    })

    .lean();
}
async function insert(areaInterestInfo) {
  const newAreaInterest = new areaInterestModel(areaInterestInfo);
  await newAreaInterest.save();
  return newAreaInterest;
}
async function removeAreaInterestById(AreaInterestId) {
  const student = await studentModel.find({ areaOfInterest: AreaInterestId });
  if (student.length > 0) {
    throw new Error("AreaInterest cannot be deleted it is used in student model");
  }

  //check if AreaInterestId is used in mentor model areaOfInterest array remove it from array
  const mentors = await mentorModel.find({ areaOfInterest: AreaInterestId });
  if (mentors.length > 0) {
    mentors.forEach(async (mentor) => {
      const index = mentor.areaOfInterest.indexOf(AreaInterestId);
      if (index > -1) {
        mentor.areaOfInterest.splice(index, 1);
        await mentor.save();
      }
    });
  }

  await areaInterestModel.deleteOne({ _id: AreaInterestId });
  return;
}
export default { findAll, insert, findById, updateById, removeAreaInterestById };
