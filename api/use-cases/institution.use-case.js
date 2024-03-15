import { institutionRepo, userRepo, studentRepo, profileViewsRepo, applicationRepo, meetingRepo } from "../data-access-layer/index.js";
import { makeInstitution } from "../entities/index.js";

async function createInstitutionUseCase(institutionInfo) {

    //loop over institutionInfo and check if any field is empty then set it to undefined
    const fields = Object.keys(institutionInfo);
    for (const field of fields) {
      // Check if field is empty (including undefined or nullable values)
      if (institutionInfo[field] === null || institutionInfo[field] =='') {
        institutionInfo[field] = undefined;
      }
    }

  if (institutionInfo.addresses) institutionInfo.addresses = JSON.parse(institutionInfo.addresses);
  if (institutionInfo.careerAdvisingLocation) institutionInfo.careerAdvisingLocation = JSON.parse(institutionInfo.careerAdvisingLocation);
  const newInstitution = await makeInstitution({ ...institutionInfo, _id: institutionInfo.subModel });
  return await institutionRepo.insert(newInstitution);
}
async function addStudents(students) {
  await userRepo.insertMany(students);

  students = students.map((student) => {
    student._id = student.subModel;
    return student;
  });
  await studentRepo.insertMany(students);
}
async function getInstitutionsUseCase(query, paginationQuery) {
  return await institutionRepo.findAll(query, paginationQuery);
}

async function getInstitutionStudentsUseCase(id, query,paginationQuery) {
  return await studentRepo.findAllByInstitution(id,query?.major,paginationQuery);
}
async function getInstitutionByIdUseCase(institutionId) {
  return await institutionRepo.findById(institutionId);
}

async function updateInstitutionByIdUseCase(institutionId, institutionInfo) {
  let oldInstitution = await institutionRepo.findByIdWithoutPopulate(institutionId);
  if (institutionInfo.careerAdvisingLocation) institutionInfo.careerAdvisingLocation = JSON.parse(institutionInfo.careerAdvisingLocation);
  //careerAdvisingPhone
  
  if (institutionInfo.addresses) institutionInfo.addresses = JSON.parse(institutionInfo.addresses);

  oldInstitution = { ...oldInstitution, ...institutionInfo, _id: institutionId };

  const newInstitution = makeInstitution(oldInstitution);

  return await institutionRepo.updateById(institutionId, newInstitution);
}
async function getNumberOfStudentsWhoFollowedInstitution(institutionId) {
  return await studentRepo.getNumberOfStudentsWhoFollowedInstitution(institutionId);
}

async function findAllUsersWhoViewedAProfileUseCase(userId, query) {
  return await profileViewsRepo.findAllUsersWhoViewedAProfile(userId, query.startDate, query.endDate);
}
async function getNumberOfStudentsHiredByCompanyUseCase(institutionId) {
  return await applicationRepo.getUsersByCompanyAndInstitution(institutionId);
}

// get users applications by institution
async function getInstitutionApplicationsUseCase(institutionId, paginationQuery) {
  let application = await applicationRepo.getStudentsByInstitution(institutionId,paginationQuery);
  return application
}

// get users applications by institution and hired
async function getInstitutionApplicationsHiredUseCase(institutionId, paginationQuery) {
  let application = await applicationRepo.getStudentsByInstitutionAndHired(institutionId,paginationQuery);
  return application
}

async function findMentorshipSessionByInstitutionUseCase(institutionId, paginationQuery) {
  return await meetingRepo.findMentorshipSessionByInstitution(institutionId, paginationQuery);
}

async function findMentorshipSessionByInstitutionOngoingUseCase(institutionId, paginationQuery) {
  return await meetingRepo.findMentorshipSessionByInstitutionOngoing(institutionId, paginationQuery);
}

export default {
  createInstitutionUseCase,
  getInstitutionsUseCase,
  getInstitutionByIdUseCase,
  updateInstitutionByIdUseCase,
  getInstitutionStudentsUseCase,
  getNumberOfStudentsWhoFollowedInstitution,
  findAllUsersWhoViewedAProfileUseCase,
  addStudents,
  getNumberOfStudentsHiredByCompanyUseCase,
  getInstitutionApplicationsUseCase,
  getInstitutionApplicationsHiredUseCase,
  findMentorshipSessionByInstitutionUseCase,
  findMentorshipSessionByInstitutionOngoingUseCase
};
