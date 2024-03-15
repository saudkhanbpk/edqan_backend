// paginator, userVersion, studentRepo, companyRepo, institutionRepo, mentorRepo, userTypesModelNamesEnum;
import paginator from "../../helper/paginator.js";
import userVersion from "../models/userVersion.model.js";
import studentRepo from "./student.repo.js";
import companyRepo from "./company.repo.js";
import institutionRepo from "./institution.repo.js";
import mentorRepo from "./mentor.repo.js";
import userTypesModelNamesEnum from "../../types/userTypesModelNames.enum.js";
import companyVersionRepo from "./companyVersion.repo.js";
import institutionVersionRepo from "./institutionVersion.repo.js";
import institutionVersionModel from "../models/institutionVersion.model.js";
import companyVersionModel from "../models/companyVersion.model.js";

let populateArray = ["city", "country", "province"];

// async function bulkSave(users) {
//   return await userVersion.bulkSave(users);
// }
// async function findAll(query, paginationQuery, approved) {
//   populateArray = ["city", "country", "socialMediaLinks.socialMedia"];

//   if (query.model) query.model = { $in: query.model };
//   if (query.accountVisibility) query.accountVisibility = { $in: query.accountVisibility };
//   //return query where user newData field exists
//   if (query.newData == true) query.newData = { $exists: query.newData };
//   const queryResult = await paginator(userVersion, query, paginationQuery, populateArray);

//   for (let i = 0; i < queryResult.queryResult.length; i++) {
//     if (queryResult.queryResult[i].model === userTypesModelNamesEnum.STUDENT){
//       if(query.accountVisibility=='employer'){
//         queryResult.queryResult[i].subModel = await studentRepo.findOne(queryResult.queryResult[i].subModel,query.accountVisibility);
//       }
//       queryResult.queryResult[i].subModel = await studentRepo.findById(queryResult.queryResult[i].subModel);
//     }
//     else if (queryResult.queryResult[i].model === userTypesModelNamesEnum.MENTOR)
//       queryResult.queryResult[i].subModel = await mentorRepo.findById(queryResult.queryResult[i].subModel);
//     else if (queryResult.queryResult[i].model === userTypesModelNamesEnum.COMPANY)
//       queryResult.queryResult[i].subModel = await companyRepo.findById(queryResult.queryResult[i].subModel);
//     else if (queryResult.queryResult[i].model === userTypesModelNamesEnum.INSTITUTION)
//       queryResult.queryResult[i].subModel = await institutionRepo.findById(queryResult.queryResult[i].subModel);
//   }

//   return queryResult;
// }
async function removeUserById(userId) {
  //check if user model is student or mentor or company or institution
  let user = await userVersion.findOne({ userId: userId }).lean();
  if (user?.model === userTypesModelNamesEnum.COMPANY) await companyVersionModel.deleteOne({ user: user._id });
  else if (user?.model === userTypesModelNamesEnum.INSTITUTION) await institutionVersionModel.deleteOne({ user: user._id });
  await userVersion.deleteOne({ userId: userId });
  return;
}
//analytics  queries
// make query to get number of users by  passing model name
// async function getNumberOfUsersByType(modelName) {
//   return await userVersion.find({ model: modelName }).countDocuments();
// }
// async function findByIdWithoutPopulate(userId) {
//   return await userVersion.findById(userId).lean();
// }
async function findById(userId) {
  populateArray = ["city", "country", "province", "socialMediaLinks.socialMedia"];
  let user = await userVersion
    .findById(userId)
    .populate([...populateArray])
    .lean();
  if (user.model === userTypesModelNamesEnum.COMPANY) user.subModel = await companyVersionRepo.findById(user.subModel);
  else if (user.model === userTypesModelNamesEnum.INSTITUTION) user.subModel = await institutionVersionRepo.findById(user.subModel);
  return user;
}

async function findByIdWithoutPopulate(userId) {
  return await userVersion.findById(userId).lean();
}
// async function findByEmail(userEmail) {
//   let user = await userVersion
//     .findOne({ email: userEmail })
//     .populate([...populateArray])
//     .lean();
//   if (user.model === userTypesModelNamesEnum.STUDENT) user.subModel = await studentRepo.findById(user.subModel);
//   else if (user.model === userTypesModelNamesEnum.MENTOR) user.subModel = await mentorRepo.findById(user.subModel);
//   else if (user.model === userTypesModelNamesEnum.COMPANY) user.subModel = await companyRepo.findById(user.subModel);
//   else if (user.model === userTypesModelNamesEnum.INSTITUTION) user.subModel = await institutionRepo.findById(user.subModel);
//   return user;
// }
async function updateById(userId, updatedUserInfo) {
  // populateArray = ["city", "country", "socialMediaLinks.socialMedia"];

  let user = await userVersion
    .findByIdAndUpdate(userId, updatedUserInfo, {
      new: true,
      runValidators: true,
    })
    .lean();
  //  if (user.model === userTypesModelNamesEnum.COMPANY) user.subModel = await companyRepo.findById(user.subModel);
  // else if (user.model === userTypesModelNamesEnum.INSTITUTION) user.subModel = await institutionRepo.findById(user.subModel);
  return user;
}
// async function updateByEmail(userEmail, updatedUserInfo) {
//   return await userVersion
//     .findOneAndUpdate({ email: userEmail }, updatedUserInfo, {
//       new: true,
//       runValidators: true,
//     })
//     .populate(populateArray)
//     .lean();
// }
async function insert(userInfo) {
  userInfo.userId = userInfo._id;
  const newUser = new userVersion(userInfo);
  await newUser.save();
  return newUser;
}
//make query to insert many users at once
// async function insertMany(users) {
//   return await userVersion.insertMany(users);
// }
//make query to get number of users added in a given time period

//make query to get number of users who have completed their profile
// async function getNumberOfUsersWhoCompletedProfile() {
//   return await userVersion.find({ completed: true }).countDocuments();
// }
// async function areAllFieldsFilled(userId) {
//   const user = await userVersion.findById(userId).lean();
//   let subModel;
//   if (user.model === userTypesModelNamesEnum.STUDENT) {
//     subModel = await studentRepo.findByIdWithoutPopulate(user.subModel);
//   } else if (user.model === userTypesModelNamesEnum.MENTOR) {
//     subModel = await mentorRepo.findByIdWithOutPopulation(user.subModel);
//   } else if (user.model === userTypesModelNamesEnum.COMPANY) {
//     subModel = await companyRepo.findByIdWithoutPopulate(user.subModel);
//   } else if (user.model === userTypesModelNamesEnum.INSTITUTION) {
//     subModel = await institutionRepo.findByIdWithoutPopulate(user.subModel);
//   }

//   const fields = Object.keys(subModel);

//   // for (const field of fields) {
//   //   // Exclude fields with default values
//   //   if (!subModel[field] && subModel[field] !== 0 && subModel[field] !== false) {
//   //     return false;
//   //   }
//   // }

//   for (const field of fields) {
//     // Check if field is empty (including undefined or nullable values)
//     if (subModel[field] === null || subModel[field] === undefined) {
//       return false;
//     }
//   }

//   // All fields are filled
//   return true;
// }
//make update function to update only newData field
// async function updateNewData(userId, newData) {
//   return await userVersion.findByIdAndUpdate(userId, { newData: newData }, { new: true, runValidators: true });
// }

// get users with new data

// async function getUsersWithNewData(paginationQuery) {
//   populateArray = ["city", "country", "socialMediaLinks.socialMedia"];
//   let query = { newData: { $exists: true } };
//   const queryResult = await paginator(userVersion, query, paginationQuery, populateArray);

//   for (let i = 0; i < queryResult.queryResult.length; i++) {
//     if (queryResult.queryResult[i].model === userTypesModelNamesEnum.STUDENT)
//       queryResult.queryResult[i].subModel = await studentRepo.findById(queryResult.queryResult[i].subModel);
//     else if (queryResult.queryResult[i].model === userTypesModelNamesEnum.MENTOR)
//       queryResult.queryResult[i].subModel = await mentorRepo.findById(queryResult.queryResult[i].subModel);
//     else if (queryResult.queryResult[i].model === userTypesModelNamesEnum.COMPANY)
//       queryResult.queryResult[i].subModel = await companyRepo.findById(queryResult.queryResult[i].subModel);
//     else if (queryResult.queryResult[i].model === userTypesModelNamesEnum.INSTITUTION)
//       queryResult.queryResult[i].subModel = await institutionRepo.findById(queryResult.queryResult[i].subModel);
//   }

//   return queryResult;
// }

export default {
  // findAll,
  insert,
  findById,
  updateById,
  // findByEmail,
  // updateByEmail,
  // removeUserById,
  // findByIdWithoutPopulate,
  // getNumberOfUsersByType,
  // // getNumberOfUsersByTypeAndStatusAndGender,
  // getNumberOfUsersAddedInTimePeriod,
  // getNumberOfUsersWhoCompletedProfile,
  // areAllFieldsFilled,
  // bulkSave,
  // insertMany,
  // updateNewData,
  // getUsersWithNewData,
  findByIdWithoutPopulate,
  removeUserById,
};
