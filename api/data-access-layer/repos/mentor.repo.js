import mentorModel from "../models/mentor.model.js";
import paginator from "../../helper/paginator.js";
import userRepo from "./user.repo.js";

async function findAll(mentorShipType, preferredLanguage, paginationQuery) {
  let query = {};

  // if (approved) {
  //   query = { 'user.approved': true }; // Only return mentors with user.approved = true
  // }
  if (mentorShipType) query.areaOfInterest = { $in: [mentorShipType] };
  // if (preferredLanguage) query.mentoringLanguages = { $in: [preferredLanguage] };
  const queryResult = await paginator(mentorModel, query, paginationQuery, [
    "almaMater",
    "mentorShipTypes",
    "majors",
    "major",
    "mentoringLanguages",
    "industries",
    "countries",
    "educationLevel",
  ]);

  return queryResult;
}
async function findAllWithAvaTime(mentorShipType, preferredLanguage, paginationQuery) {
  let query = {};

  // if (approved) {
  //   query = { 'user.approved': true }; // Only return mentors with user.approved = true
  // }
  //make sure that availabilityTime is not empty
  query.availabilityTime = { $ne: [] };
  if (mentorShipType) query.areaOfInterest = { $in: [mentorShipType] };
  // if (preferredLanguage) query.mentoringLanguages = { $in: [preferredLanguage] };
  const queryResult = await paginator(mentorModel, query, paginationQuery, [
    "almaMater",
    "mentorShipTypes",
    "majors",
    "major",
    "mentoringLanguages",
    "industries",
    "countries",
    "educationLevel",
  ]);

  // this gets the profile image of the mentor from the user model, this approach is not ideal and has to be replaced with the aggregate in the paginator
  for (const mentor of queryResult.queryResult) {
    let user = await userRepo.findById(mentor.user);
    mentor.profileImage = user.profileImage;
  }

  return queryResult;
}
async function findAllConnection(userId, almaMater, major, industry, areaOfInterest, paginationQuery) {
  let query = {};
  if (almaMater) query.almaMater = almaMater;
  if (major) query.majors = { $in: [major] };
  if (industry) query.industries = { $in: [industry] };

  if (areaOfInterest) query.areaOfInterest = { $in: [areaOfInterest] };
  query.user = { $ne: userId };
  const queryResult = await paginator(
    mentorModel,
    query,
    paginationQuery,
    ["almaMater", "mentorShipTypes", "majors", "major", "mentoringLanguages", "industries", "countries", "educationLevel", "areaOfInterest", "user"],
    { createdAt: -1 }
  );

  return queryResult;
}
async function findByIdWithOutPopulation(mentorId) {
  return await mentorModel.findById(mentorId).lean();
}
async function findByUserWithOutPopulation(userId) {
  return await mentorModel.findOne({ user: userId }).lean();
}
async function findById(mentorId) {
  return await mentorModel
    .findById(mentorId)
    .populate("mentorShipTypes")
    .populate("mentoringLanguages")
    .populate("industries")
    .populate({
      path: "almaMater",
      populate: [
        {
          path: "subModel",
        },
      ],
    })
    // .populate({
    //   path: "company",
    //   populate: [
    //     {
    //       path: "subModel",
    //     }
    //   ]
    // })
    .populate("majors")
    .populate("major")
    .populate("countries")
    .populate("educationLevel")
    .populate("areaOfInterest")
    .lean();
}
async function findAllWithoutPopulate() {
  return await mentorModel.find().lean();
}
async function updateWithoutPopulate(mentorId, updateInfo) {
  return await mentorModel.findByIdAndUpdate(mentorId, updateInfo).lean();
}
async function updateMany(query, updateInfo) {
  return await mentorModel.updateMany(query, updateInfo).lean();
}
async function updateById(mentorId, updatedMentorInfo) {
  return await mentorModel
    .findByIdAndUpdate(mentorId, updatedMentorInfo, { new: true })
    // .populate("company")
    .populate("mentorShipTypes")
    .populate("mentoringLanguages")
    .populate("industries")
    .populate("countries")
    .populate("educationLevel")
    .populate("areaOfInterest")

    .lean();
}
async function insert(mentorInfo) {
  const newMentor = new mentorModel(mentorInfo);
  await newMentor.save();
  return newMentor;
}
async function removeMentorById(MentorId) {
  await mentorModel.deleteOne({ _id: MentorId });
  return;
}

export default {
  findAll,
  insert,
  findById,
  updateById,
  removeMentorById,
  findByIdWithOutPopulation,
  findAllConnection,
  findByUserWithOutPopulation,
  updateWithoutPopulate,
  findAllWithoutPopulate,
  updateMany,
  findAllWithAvaTime,
};
