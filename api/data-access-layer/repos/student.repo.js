import studentModel from "../models/student.model.js";
import applicationModel from "../models/application.model.js";
import paginator from "../../helper/paginator.js";
import userModel from "../models/user.model.js";

async function findAll() {
  return await studentModel.find().lean();
}
async function findByIdWithoutPopulate(studentId) {
  return await studentModel.findById(studentId).lean();
}
async function findByUserId(userId) {
  return await studentModel
    .find({ user: userId })
    .select("-jobMajors -savedJobs -followedCompanies")
    .populate("institution")
    .populate("fluentLanguage")
    .populate("proficientLanguage")
    .populate("major")
    .populate("areaOfInterest")
    .populate("educationLevel")
    .populate("careerInterest.city")
    .populate({
      path: "careerInterest.jobType",
    })
    .populate("careerInterest.city")
    .populate("careerInterest.jobType")
    .populate("careerInterest.subIndustry")
    .populate("careerInterest.jobRole")
    .populate({ path: "careerInterest.subIndustry" })
    .populate({ path: "education.educationLevel" })
    .populate({
      path: "projects",
      populate: [{ path: "city" }],
    })
    .populate({
      path: "projects",
      populate: [{ path: "country" }],
    })
    .populate({
      path: "projects",
      populate: [{ path: "province" }],
    })
    .populate({
      path: "education",
      populate: [{ path: "major" }],
    })
    .populate({
      path: "education",
      populate: [{ path: "country" }],
    })
    .populate({
      path: "education",
      populate: [{ populate: "city" }],
    })
    .populate({
      path: "education",
      populate: [{ populate: "province" }],
    })
    .populate({
      path: "volunteers",
      populate: [{ path: "educationLevel" }],
    })
    .populate({
      path: "volunteers",
      populate: [{ path: "country" }],
    })
    .populate({
      path: "volunteers",
      populate: [{ path: "city" }],
    })
    .populate({
      path: "volunteers",
      populate: [{ path: "province" }],
    })
    .populate({
      path: "institution",
      populate: [{ path: "subModel" }],
    })
    .populate({ path: "projects.country" })
    .lean();
}
async function findOne(id, visbility) {
  return await studentModel.findOne({ _id: id, accountVisibility: { $in: visbility } }).populate("institution")
    .populate("fluentLanguage")
    .populate("proficientLanguage")
    .populate("major")
    .populate("areaOfInterest")
    .populate("educationLevel")
    .populate("careerInterest.city")
    .populate({
      path: "careerInterest.jobType",
    })
    .populate("jobMajors")
    .populate({ path: "careerInterest.subIndustry" })
    .populate("careerInterest.city")
    .populate("careerInterest.jobType")
    .populate("careerInterest.subIndustry")
    .populate("careerInterest.jobRole")
    .populate({ path: "education.educationLevel" })
    .populate({
      path: "projects",
      populate: [{ path: "city" }],
    })
    .populate({
      path: "projects",
      populate: [{ path: "country" }],
    })
    .populate({
      path: "projects",
      populate: [{ path: "province" }],
    })
    .populate({
      path: "institution",
      populate: [{ path: "subModel" }],
    })
    .populate({
      path: "education",
      populate: [{ path: "major" }],
    })
    .populate({
      path: "education",
      populate: [{ path: "country" }],
    })
    .populate({
      path: "education",
      populate: [{ path: "city" }],
    })
    .populate({
      path: "education",
      populate: [{ path: "province" }],
    })
    .populate({
      path: "volunteers",
      populate: [{ path: "educationLevel" }],
    })
    .populate({
      path: "volunteers",
      populate: [{ path: "country" }],
    })
    .populate({
      path: "volunteers",
      populate: [{ path: "city" }],
    })
    .populate({
      path: "volunteers",
      populate: [{ path: "province" }],
    })
    .populate({ path: "projects.country" })
    .lean();
}
async function findById(studentId) {
  return await studentModel
    .findById(studentId)
    .populate("institution")
    .populate("fluentLanguage")
    .populate("proficientLanguage")
    .populate("major")
    .populate("areaOfInterest")
    .populate("educationLevel")
    .populate("careerInterest.city")
    .populate({
      path: "careerInterest.jobRole",
    })
    .populate("jobMajors")
    .populate({ path: "careerInterest.subIndustry" })
    .populate("careerInterest.country")
    .populate("careerInterest.workType")
    .populate("careerInterest.subIndustry")
    // .populate("careerInterest.jobRole")
    .populate({ path: "education.educationLevel" })
    .populate({
      path: "projects",
      populate: [{ path: "city" }],
    })
    .populate({
      path: "projects",
      populate: [{ path: "country" }],
    })
    .populate({
      path: "projects",
      populate: [{ path: "province" }],
    })
    .populate({
      path: "institution",
      populate: [{ path: "subModel" }],
    })
    .populate({
      path: "education",
      populate: [{ path: "major" }],
    })
    .populate({
      path: "education",
      populate: [{ path: "country" }],
    })
    .populate({
      path: "education",
      populate: [{ path: "city" }],
    })
    .populate({
      path: "education",
      populate: [{ path: "province" }],
    })
    .populate({
      path: "volunteers",
      populate: [{ path: "educationLevel" }],
    })
    .populate({
      path: "volunteers",
      populate: [{ path: "country" }],
    })
    .populate({
      path: "volunteers",
      populate: [{ path: "city" }],
    })
    .populate({
      path: "volunteers",
      populate: [{ path: "province" }],
    })
    .populate({ path: "projects.country" })
    .lean();
}
async function getFollowedCompany(studentId) {
  return await studentModel
    .findById(studentId)
    .lean()
    .populate([
      "followedCompanies",
      {
        path: "followedCompanies",
        populate: ["city", "country", "province"],
      },
      {
        path: "followedCompanies",
        populate: [{ path: "subModel", populate: [{ path: "headQuarters", populate: ["country", "city", "province"] }] }],
      },
      {
        path: "followedCompanies",
        populate: [{ path: "subModel", populate: [{ path: "industries", populate: ["industry", "subIndustries"] }] }],
      },
    ])

    .select("-_id followedCompanies");
}
async function getSavedJobs(studentId) {
  return await studentModel
    .findById(studentId)
    .populate([
      "savedJobs",
      {
        path: "savedJobs",
        populate: ["jobType", "workType", "major"],
      },
      {
        path: "savedJobs",
        populate: ["city", "country", "province", "currency"],
      },
      {
        path: "savedJobs",
        populate: [{ path: "company", populate: [{ path: "subModel", populate: [{ path: "headQuarters", populate: ["country", "city", "province"] }] }] }],
      },
      {
        path: "savedJobs",
        populate: [
          { path: "company", populate: [{ path: "subModel", populate: [{ path: "industries", populate: ["industry", "subIndustries"] }] }] },
        ],
      },
    ])
    .select("-_id savedJobs");
}
async function updateById(studentId, updatedStudentInfo) {
  return await studentModel
    .findByIdAndUpdate(studentId, updatedStudentInfo, {
      new: true,
      runValidators: true,
    })
    .lean();
}
async function updateCareerInterestByStudentId(studentId, updatedStudentInfo) {
  return await studentModel
    .findByIdAndUpdate(studentId, updatedStudentInfo, {
      new: true,
      runValidators: true,
    })
    .select("-_id careerInterest")
    .populate("careerInterest.city")
    .populate("careerInterest.jobType")
    .populate("careerInterest.subIndustry")
    .populate("careerInterest.jobRole")
    .lean();
}
async function addjobMajor(studentId, jobId) {
  return await studentModel.findByIdAndUpdate(studentId, jobId, {
    new: true,
    runValidators: true,
  });
}
async function saveJob(studentId, jobId) {
  return await studentModel.findByIdAndUpdate(studentId, {
    $push: { savedJobs: jobId },
  });
}
async function unSaveJob(studentId, jobId) {
  return await studentModel.findByIdAndUpdate(studentId, {
    $pull: { savedJobs: jobId },
  });
}
async function followCompany(studentId, companyId) {
  return await studentModel.findByIdAndUpdate(studentId, {
    $push: { followedCompanies: companyId },
  });
}
//follow institution
// async function followInstitution(studentId, institutionId) {
//   return await studentModel.findByIdAndUpdate(studentId, {
//     $push: { followedInstitutions: institutionId },
//   });
// }
async function unFollowCompany(studentId, companyId) {
  return await studentModel.findByIdAndUpdate(studentId, {
    $pull: { followedCompanies: companyId },
  });
}

//unfollow institution
// async function unFollowInstitution(studentId, institutionId) {
//   return await studentModel.findByIdAndUpdate(studentId, {
//     $pull: { followedInstitutions: institutionId },
//   });
// }
async function insert(studentInfo) {
  const newStudent = new studentModel(studentInfo);
  await newStudent.save();
  return newStudent;
}
async function removeStudentById(StudentId) {
  await studentModel.deleteOne({ _id: StudentId });
  return;
}
async function getCompaniesThatHiresFromStudentsInstitution(studentId, paginationQuery) {
  // Find the student's institution
  const student = await studentModel.findById(studentId);
  let institutionId;
  if (student) {
    institutionId = student.institution;
  }
  else {
    //this is for the use of institute direct
    institutionId = studentId
  }
  const queryResult = await paginator(applicationModel, { status: "1" }, paginationQuery, [
    {
      path: "user",
      populate: {
        path: "subModel",
        populate: {
          path: "institution",
          match: { _id: institutionId }, // Filter institution based on institutionId
        },
      },
    },
    { path: "company", populate: ["country", "city", "province"] },
    { path: "company", populate: [{ path: "subModel", populate: [{ path: "industries", populate: ["industry", "subIndustries"] }] }] },
    { path: "company", populate: [{ path: "subModel", populate: [{ path: "headQuarters", populate: ["country", "city", "province"] }] }] },
  ]);
  // map company from application to get only company
  queryResult.queryResult = queryResult.queryResult.map((application) => application.company);

  //remove duplicate companies without changing the structure of queryResult

  queryResult.queryResult = queryResult.queryResult.filter((company, index, self) => {
    return index === self.findIndex((t) => t._id === company._id);
  });
  // then update the queryResult length
  queryResult.queryDataLength = queryResult.queryResult.length;
  // update wholeModelDataCount
  return queryResult;
}


async function findAllByInstitution(institutionId, major, paginationQuery) {
  let query = {};
  query.institution = institutionId;
  if (major) query.major = major;


  const student = await studentModel.find(query).select('user').lean();

  let userQuery = { _id: { $in: student.map((student) => student.user) } };
  let populateArray = ["city", "country", "province", "socialMediaLinks.socialMedia"];

  const queryResult = await paginator(userModel, userQuery, paginationQuery, populateArray);

  for (let i = 0; i < queryResult.queryResult.length; i++) {
    queryResult.queryResult[i].subModel = await this.findById(queryResult.queryResult[i].subModel);
  }

  // Sort the queryResult by lastName in alphabetical order
  queryResult.queryResult.sort((a, b) => {
    const lastNameA = a.subModel.lastName.toLowerCase();
    const lastNameB = b.subModel.lastName.toLowerCase();
    if (lastNameA < lastNameB) return -1;
    if (lastNameA > lastNameB) return 1;
    return 0;
  });

  return queryResult;
}

//dashboard analytics
//get number of students who followed specific company
async function getNumberOfStudentsWhoFollowedCompany(companyId) {
  return await studentModel.countDocuments({ followedCompanies: companyId });
}
// make function to return number of students following specific institution
async function getNumberOfStudentsWhoFollowedInstitution(institutionId) {
  return await studentModel.countDocuments({ institution: institutionId });
}
//make query to insert many users at once
async function insertMany(users) {
  return await studentModel.insertMany(users);
}
// make query to update student jobSubIndustries array wirth job subIndustries Ids
async function updateStudentJobSubIndustries(studentId, jobSubIndustries) {
  return await studentModel.findByIdAndUpdate(studentId, {
    jobSubIndustries: jobSubIndustries,
  });
}


// get students by major id using pagination

async function getStudentsByMajorId(majorId, paginationQuery) {
  let query = { major: majorId };

  // get all students by major id and select user id only without any populate or pagination

  const student = await studentModel.find(query).select('user').lean();

  let userQuery = { _id: { $in: student.map((student) => student.user) } };
  let populateArray = ["city", "country", "province", "socialMediaLinks.socialMedia"];

  const queryResult = await paginator(userModel, userQuery, paginationQuery, populateArray);

  for (let i = 0; i < queryResult.queryResult.length; i++) {
    queryResult.queryResult[i].subModel = await this.findById(queryResult.queryResult[i].subModel);
  }

  return queryResult;
}








export default {
  findAll,
  insert,
  findById,
  updateById,
  removeStudentById,
  updateCareerInterestByStudentId,
  addjobMajor,
  saveJob,
  followCompany,
  getFollowedCompany,
  getSavedJobs,
  findByIdWithoutPopulate,
  getCompaniesThatHiresFromStudentsInstitution,
  unSaveJob,
  unFollowCompany,
  findByUserId,
  findAllByInstitution,
  getNumberOfStudentsWhoFollowedCompany,
  getNumberOfStudentsWhoFollowedInstitution,
  insertMany,
  getStudentsByMajorId,
  findOne,
  // followInstitution,
  // unFollowInstitution

};
