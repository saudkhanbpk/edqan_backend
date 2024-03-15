// paginator,
//   userModel,
//   studentRepo,
//   companyRepo,
//   institutionRepo,
//   mentorRepo,
//   userTypesModelNamesEnum;
import paginator from "../../helper/paginator.js";
import userModel from "../models/user.model.js";
import studentRepo from "./student.repo.js";
import companyRepo from "./company.repo.js";
import institutionRepo from "./institution.repo.js";
import mentorRepo from "./mentor.repo.js";
import userTypesModelNamesEnum from "../../types/userTypesModelNames.enum.js";
import accountVisibilityEnum from "../../types/accountVisibility.enum.js";
import userVersionRepo from "./userVersion.repo.js";
import chatRepo from "./chat.repo.js";
import meetingModel from "../models/meeting.model.js";

let populateArray = ["city", "country", "province"];

async function bulkSave(users) {
  return await userModel.bulkSave(users);
}
async function findAll(query, paginationQuery, approved) {
  populateArray = ["city", "country", "province", "socialMediaLinks.socialMedia"];

  if (query?.model) query.model = { $in: query.model };
  const queryResult = await paginator(userModel, query, paginationQuery, populateArray, { updatedAt: -1 });

  for (let i = 0; i < queryResult.queryResult.length; i++) {
    if (queryResult.queryResult[i].model === userTypesModelNamesEnum.STUDENT) {
      //if query . accounti visbinitlyt
      if (query?.accountVisibility?.some((value) => ["employer", "community"].includes(value))) {
        queryResult.queryResult[i].subModel = await studentRepo.findOne(queryResult.queryResult[i].subModel, query.accountVisibility);
        if (queryResult.queryResult[i].subModel == null) {
          queryResult.queryResult.splice(i, 1); // Remove the item from the array
          i--; // Adjust the loop counter
        }
      } else {
        queryResult.queryResult[i].subModel = await studentRepo.findById(queryResult.queryResult[i].subModel);
      }
    } else if (queryResult.queryResult[i].model === userTypesModelNamesEnum.MENTOR)
      queryResult.queryResult[i].subModel = await mentorRepo.findById(queryResult.queryResult[i].subModel);
    else if (queryResult.queryResult[i].model === userTypesModelNamesEnum.COMPANY)
      queryResult.queryResult[i].subModel = await companyRepo.findById(queryResult.queryResult[i].subModel);
    else if (queryResult.queryResult[i].model === userTypesModelNamesEnum.INSTITUTION)
      queryResult.queryResult[i].subModel = await institutionRepo.findById(queryResult.queryResult[i].subModel);
  }

  return queryResult;
}
async function removeUserById(UserId) {
  //check if user model is student or mentor or company or institution
  let user = await userModel.findById(UserId).lean();
  if (user.model === userTypesModelNamesEnum.STUDENT) await studentRepo.removeStudentById(user.subModel);
  else if (user.model === userTypesModelNamesEnum.MENTOR) await mentorRepo.removeMentorById(user.subModel);
  else if (user.model === userTypesModelNamesEnum.COMPANY) {
    await companyRepo.removeCompanyById(user.subModel);
    await userVersionRepo.removeUserById(user._id);
  } else if (user.model === userTypesModelNamesEnum.INSTITUTION) {
    await institutionRepo.removeInstitutionById(user.subModel);
    await userVersionRepo.removeUserById(user._id);
  }
  // delete chat also with this user
  await chatRepo.deleteAllChatsByUserId(UserId);

  //delete all meetings
  await meetingModel.deleteMany({ $or: [{ "user1.user": UserId }, { "user2.user": UserId }] });

  await userModel.deleteOne({ _id: UserId });
  return;
}
//analytics  queries
// make query to get number of users by  passing model name
async function getNumberOfUsersByType(modelName) {
  return await userModel.find({ model: modelName }).countDocuments();
}
async function findByIdWithoutPopulate(userId) {
  return await userModel.findById(userId).lean();
}
async function findById(userId) {
  populateArray = ["city", "country", "province", "socialMediaLinks.socialMedia"];
  let user = await userModel
    .findById(userId)
    .populate([...populateArray])
    .lean();
  if (user.model === userTypesModelNamesEnum.STUDENT) user.subModel = await studentRepo.findById(user.subModel);
  else if (user.model === userTypesModelNamesEnum.MENTOR) user.subModel = await mentorRepo.findById(user.subModel);
  else if (user.model === userTypesModelNamesEnum.COMPANY) user.subModel = await companyRepo.findById(user.subModel);
  else if (user.model === userTypesModelNamesEnum.INSTITUTION) user.subModel = await institutionRepo.findById(user.subModel);
  return user;
}
async function findByEmail(userEmail) {
  let user = await userModel
    .findOne({ email: userEmail })
    .populate([...populateArray])
    .lean();
  if (!user) return null;
  if (user.model === userTypesModelNamesEnum.STUDENT) user.subModel = await studentRepo.findById(user.subModel);
  else if (user.model === userTypesModelNamesEnum.MENTOR) user.subModel = await mentorRepo.findById(user.subModel);
  else if (user.model === userTypesModelNamesEnum.COMPANY) user.subModel = await companyRepo.findById(user.subModel);
  else if (user.model === userTypesModelNamesEnum.INSTITUTION) user.subModel = await institutionRepo.findById(user.subModel);
  return user;
}
async function updateById(userId, updatedUserInfo) {
  populateArray = ["city", "country", "province", "socialMediaLinks.socialMedia"];
  if (updatedUserInfo.newData == undefined) {
    await userModel.findByIdAndUpdate(userId, { $unset: { newData: 1 } }, { new: true });
  }
  let user = await userModel
    .findByIdAndUpdate(userId, updatedUserInfo, {
      new: true,
      runValidators: true,
    })
    .populate(populateArray)
    .lean();
  if (user.model === userTypesModelNamesEnum.STUDENT) user.subModel = await studentRepo.findById(user.subModel);
  else if (user.model === userTypesModelNamesEnum.MENTOR) user.subModel = await mentorRepo.findById(user.subModel);
  else if (user.model === userTypesModelNamesEnum.COMPANY) user.subModel = await companyRepo.findById(user.subModel);
  else if (user.model === userTypesModelNamesEnum.INSTITUTION) user.subModel = await institutionRepo.findById(user.subModel);
  return user;
}
async function updateByEmail(userEmail, updatedUserInfo) {
  return await userModel
    .findOneAndUpdate({ email: userEmail }, updatedUserInfo, {
      new: true,
      runValidators: true,
    })
    .populate(populateArray)
    .lean();
}
async function insert(userInfo) {
  const newUser = new userModel(userInfo);
  await newUser.save();
  return newUser;
}
//make query to insert many users at once
async function insertMany(users) {
  return await userModel.insertMany(users);
}
//make query to get number of users added in a given time period
async function getNumberOfUsersAddedInTimePeriod(startDate, endDate) {
  return await userModel.find({ createdAt: { $gte: startDate, $lte: endDate } }).countDocuments();
}
//make query to get number of users who have completed their profile
async function getNumberOfUsersWhoCompletedProfile() {
  return await userModel.find({ completed: true }).countDocuments();
}
async function areAllFieldsFilled(userId) {
  const user = await userModel.findById(userId).lean();
  let subModel;
  if (user.model === userTypesModelNamesEnum.STUDENT) {
    subModel = await studentRepo.findByIdWithoutPopulate(user.subModel);
  } else if (user.model === userTypesModelNamesEnum.MENTOR) {
    subModel = await mentorRepo.findByIdWithOutPopulation(user.subModel);
  } else if (user.model === userTypesModelNamesEnum.COMPANY) {
    subModel = await companyRepo.findByIdWithoutPopulate(user.subModel);
  } else if (user.model === userTypesModelNamesEnum.INSTITUTION) {
    subModel = await institutionRepo.findByIdWithoutPopulate(user.subModel);
  }

  const fields = Object.keys(subModel);

  // for (const field of fields) {
  //   // Exclude fields with default values
  //   if (!subModel[field] && subModel[field] !== 0 && subModel[field] !== false) {
  //     return false;
  //   }
  // }

  for (const field of fields) {
    // Check if field is empty (including undefined or nullable values)
    if (subModel[field] === null || subModel[field] === undefined) {
      return false;
    }
  }

  // All fields are filled
  return true;
}
//make update function to update only newData field
async function updateNewData(userId, newData) {
  return await userModel.findByIdAndUpdate(userId, { newData: newData }, { new: true, runValidators: true });
}

// get users with new data

async function getUsersWithNewData(paginationQuery) {
  populateArray = ["city", "country", "province", "socialMediaLinks.socialMedia"];
  let query = { newData: { $exists: true } };
  const queryResult = await paginator(userModel, query, paginationQuery, populateArray);

  for (let i = 0; i < queryResult.queryResult.length; i++) {
    if (queryResult.queryResult[i].model === userTypesModelNamesEnum.STUDENT)
      queryResult.queryResult[i].subModel = await studentRepo.findById(queryResult.queryResult[i].subModel);
    else if (queryResult.queryResult[i].model === userTypesModelNamesEnum.MENTOR)
      queryResult.queryResult[i].subModel = await mentorRepo.findById(queryResult.queryResult[i].subModel);
    else if (queryResult.queryResult[i].model === userTypesModelNamesEnum.COMPANY)
      queryResult.queryResult[i].subModel = await companyRepo.findById(queryResult.queryResult[i].subModel);
    else if (queryResult.queryResult[i].model === userTypesModelNamesEnum.INSTITUTION)
      queryResult.queryResult[i].subModel = await institutionRepo.findById(queryResult.queryResult[i].subModel);
  }

  return queryResult;
}

export default {
  findAll,
  insert,
  findById,
  updateById,
  findByEmail,
  updateByEmail,
  removeUserById,
  findByIdWithoutPopulate,
  getNumberOfUsersByType,
  // getNumberOfUsersByTypeAndStatusAndGender,
  getNumberOfUsersAddedInTimePeriod,
  getNumberOfUsersWhoCompletedProfile,
  areAllFieldsFilled,
  bulkSave,
  insertMany,
  updateNewData,
  getUsersWithNewData,
};
