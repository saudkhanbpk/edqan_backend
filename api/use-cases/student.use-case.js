import { studentRepo, userRepo, meetingRepo, mentorRepo, meetingDurationRepo, mentorShipTypeRepo, areaInterestRepo, applicationRepo } from "../data-access-layer/index.js";
import meetingStatus from "../types/meetingStatus.enum.js";
import zoomMeeting from "../meeting/meeting.js";
import userNotificationsUseCase from "./userNotifications.use-case.js";
import notificationTypeEnum from "../types/notificationType.enum.js";
import { MentorReceiveSessionRequest } from "../notificationData/notificationData.js";
import { makeStudent } from "../entities/index.js";
import educationTypeEnum from "../types/educationType.enum.js";
import meetingStatusEnum from "../types/meetingStatus.enum.js";

import { makeMeeting } from "../entities/index.js";

async function createStudentUseCase(studentInfo) {
  if (studentInfo.fluentLanguage) studentInfo.fluentLanguage = JSON.parse(studentInfo.fluentLanguage);
  if (studentInfo.jobMajors) studentInfo.jobMajors = JSON.parse(studentInfo.jobMajors);
  if (studentInfo.proficientLanguage) studentInfo.proficientLanguage = JSON.parse(studentInfo.proficientLanguage);
  if (studentInfo.enrolledInHighSchool) studentInfo.enrolledInHighSchool = JSON.parse(studentInfo.enrolledInHighSchool);
  if (studentInfo.education) studentInfo.education = JSON.parse(studentInfo.education);
  if (studentInfo.skills) studentInfo.skills = JSON.parse(studentInfo.skills);
  if (studentInfo.organizations) studentInfo.organizations = JSON.parse(studentInfo.organizations);
  if (studentInfo.courses) studentInfo.courses = JSON.parse(studentInfo.courses);
  if (studentInfo.projects) studentInfo.projects = JSON.parse(studentInfo.projects);
  if (studentInfo.education) studentInfo.education = JSON.parse(studentInfo.education);
  if (studentInfo.major) studentInfo.major = JSON.parse(studentInfo.major);
  if (studentInfo.careerInterest) studentInfo.careerInterest = JSON.parse(studentInfo.careerInterest);
  if (studentInfo.volunteers) studentInfo.volunteers = JSON.parse(studentInfo.volunteers);
  if (studentInfo.agreeToTerms) studentInfo.agreeToTerms = JSON.parse(studentInfo?.agreeToTerms);
  if (studentInfo.guideLines) studentInfo.guideLines = JSON.parse(studentInfo?.guideLines);

  if (studentInfo.education == educationTypeEnum.UNDERGRADUATE) studentInfo.student = true;
  else studentInfo.student = false;
  const newStudent = await makeStudent({
    ...studentInfo,
    _id: studentInfo.subModel,
  });
  return await studentRepo.insert(newStudent);
}

async function requestMentorUseCase(user1, mentorInfo) {
  mentorInfo.user1 = { user: user1 };
  mentorInfo.mentorShipSession.status = meetingStatus.PENDING;
  /**meeting invitation with user names */
  let student = await userRepo.findByIdWithoutPopulate(user1);
  // let student_id=student.subModel
  student = await studentRepo.findById(student.subModel);
  let mentor = await userRepo.findByIdWithoutPopulate(mentorInfo.user2.user);
  mentor = await mentorRepo.findByIdWithOutPopulation(mentor.subModel);
  let meetUrl = await zoomMeeting(student.firstName, mentor.firstName);

  mentorInfo.user1 = { meetingUrl: meetUrl.user1, user: user1 };
  mentorInfo.user2 = { meetingUrl: meetUrl.user2, user: mentor.user };

  mentorInfo.mentorShipSession.status = meetingStatusEnum.PENDING;


  //   let mentorAvailability = mentor.availabilityTime;
  //   //delete any date that is less than the current date from mentorAvailability

  // // current date to be in this format 2023-08-30T00:00:00.000Z

  //   let currentDate = new Date();
  //   currentDate.setHours(0, 0, 0, 0);
  //   mentorAvailability = mentorAvailability.filter((date) => {
  //     return new Date(date.date) > currentDate;
  //   });
  //   //check if mentorAvailability has the startTime sent in mentorInfo
  //   let isAvailable = false;
  //   mentorAvailability.forEach((date) => {
  //     if (date.startTime.includes(mentorInfo.startTime)) {
  //       isAvailable = true;
  //     }
  //   });
  //   if (!isAvailable) throw new Error("Mentor is not available at this time");

  //   // delete the startTime from mentorAvailability
  //   mentorAvailability.forEach((date) => {
  //     date.startTime = date.startTime.filter((time) => time !== mentorInfo.startTime);
  //   });

  // //update mentor availability
  // mentor.availabilityTime = mentorAvailability;
  // await mentorRepo.updateById(mentor._id, mentor);

  let duration = await meetingDurationRepo.findAll();
  let durationInMinutes = duration[0].durationMinutes;
  mentorInfo.duration = durationInMinutes;
  const mentorShip = await makeMeeting(mentorInfo);
  let meeting = await meetingRepo.insert(mentorShip);

 
    // getting the mentorship name
    // const mentorShipTypeName = await areaInterestRepo
    //   .findById(mentorInfo.mentorShipSession.mentorShipType)
    //   .then((mentorShipType) => mentorShipType.nameEn);
    // await userNotificationsUseCase.createUserNotificationsUseCase(
    //   notificationTypeEnum.MENTOR_RECEIVES_SESSION_REQUEST,
    //   mentor.user,
    //   new MentorReceiveSessionRequest(student.firstName, mentor.firstName, mentorShipTypeName, `${process.env.APPLICATION_URL}mentor/mentorship-program`)
    // );

  return {
    mentorShip: meeting,
  };
}

async function getStudentsUseCase(studentInfo) {
  return await studentRepo.findAll();
}

async function getStudentByIdUseCase(studentId) {
  return await studentRepo.findById(studentId);
}

async function updateStudentByIdUseCase(studentId, studentInfo) {

  //loop over all studenInfo and if there is null value then set it null
  for (const [key, value] of Object.entries(studentInfo)) {
    if (value === "null"||value===''){
    //   if(studentInfo[key] == 'institution')
    //   {
    //     studentInfo[key] = null
    //   }
      
    //   else{
    //   studentInfo[key] = null;
    // }
    studentInfo[key] = null;

    }}

  let oldStudent = await studentRepo.findByIdWithoutPopulate(studentId);
  if (studentInfo.fluentLanguage) studentInfo.fluentLanguage = JSON.parse(studentInfo.fluentLanguage);
  if (studentInfo.proficientLanguage) studentInfo.proficientLanguage = JSON.parse(studentInfo.proficientLanguage);
  if (studentInfo.enrolledInHighSchool) studentInfo.enrolledInHighSchool = JSON.parse(studentInfo.enrolledInHighSchool);
  if (studentInfo.skills) studentInfo.skills = JSON.parse(studentInfo.skills);
  if (studentInfo.organizations) studentInfo.organizations = JSON.parse(studentInfo.organizations);
  if (studentInfo.courses) studentInfo.courses = JSON.parse(studentInfo.courses);
  if (studentInfo.projects) studentInfo.projects = JSON.parse(studentInfo.projects);
  if (studentInfo.education) studentInfo.education = JSON.parse(studentInfo.education);
  if (studentInfo.major) studentInfo.major = JSON.parse(studentInfo.major);
  // if (studentInfo.major) studentInfo.major = [studentInfo.major];   //this line is there only because the frontend sends the major as a string and not an array, and I need to figure this out, but for now this is the solution and it should be removed
  if (studentInfo.careerInterest) studentInfo.careerInterest = JSON.parse(studentInfo.careerInterest);
  if (studentInfo.volunteers) studentInfo.volunteers = JSON.parse(studentInfo.volunteers);
  if (studentInfo.jobMajors) studentInfo.jobMajors = JSON.parse(studentInfo.jobMajors);
  if (studentInfo.agreeToTerms) studentInfo.agreeToTerms = JSON.parse(studentInfo?.agreeToTerms);
  if (studentInfo.guideLines) studentInfo.guideLines = JSON.parse(studentInfo?.guideLines);
  // for (let i = 0; i < studentInfo.volunteers?.length; i++) {
  //   const startingMonth = new Date(studentInfo.volunteers[i].startingDate).getMonth();
  //   const endingMonth = new Date(studentInfo.volunteers[i].endingDate).getMonth();
  //   const monthDifference = endingMonth - startingMonth;

  //   studentInfo.volunteers[i].duration = monthDifference <= 1 ? 'month' : 'months';
  // }

  if(studentInfo?.gpa>5) throw new Error("GPA must be between 1.0 to 5.0");
  if(studentInfo?.gpa<0) throw new Error("GPA must be between 1.0 to 5.0");

  if (studentInfo.graduationDate === 'null') {
    studentInfo.graduationDate = null
  }
  oldStudent = { ...oldStudent, ...studentInfo, _id: studentId };
  const updateStudent = await makeStudent(oldStudent);

  return await studentRepo.updateById(studentId, updateStudent);
}

async function updateCareerInterestUseCase(userId, careerInterest) {
  let student = await userRepo.findByIdWithoutPopulate(userId);
  return await studentRepo.updateCareerInterestByStudentId(student.subModel, careerInterest);
}

async function addjobMajorUseCase(userId, jobMajor) {
  let student = await userRepo.findByIdWithoutPopulate(userId);
  return await studentRepo.addjobMajor(student.subModel, jobMajor);
}

async function saveJobUseCase(userId, toBeSavedJob) {
  let student = await userRepo.findByIdWithoutPopulate(userId);
  let studentData = await studentRepo.findByIdWithoutPopulate(student.subModel);
  if (studentData.savedJobs) {
    const exists = studentData?.savedJobs?.some((val) => val.toString() === toBeSavedJob.savedJobs);
    if (exists) return await studentRepo.unSaveJob(studentData._id, toBeSavedJob.savedJobs);
    return await studentRepo.saveJob(studentData._id, toBeSavedJob.savedJobs);
  } else {
    studentData.savedJobs = [toBeSavedJob.savedJobs];
    await studentRepo.updateById(studentData._id, studentData);
  }
}

async function followCompanyUseCase(userId, toBeFollowedCompany) {
  let student = await userRepo.findByIdWithoutPopulate(userId);
  let studentData = await studentRepo.findByIdWithoutPopulate(student.subModel);
  if (studentData.followedCompanies) {
    const exists = studentData.followedCompanies.some((val) => val.toString() === toBeFollowedCompany.followedCompanies);
    if (exists) await studentRepo.unFollowCompany(studentData._id, toBeFollowedCompany.followedCompanies);
    else await studentRepo.followCompany(student.subModel, toBeFollowedCompany.followedCompanies);
  } else {
    studentData.followedCompanies = [toBeFollowedCompany.followedCompanies];
    await studentRepo.updateById(studentData._id, studentData);
  }
}

//follow institution
async function followInstitutionUseCase(userId, institutionId) {
  let student = await userRepo.findByIdWithoutPopulate(userId);
  let studentData = await studentRepo.findByIdWithoutPopulate(student.subModel);
  if (studentData.followedInstitutions) {
    const exists = studentData.followedInstitutions.some((val) => val.toString() === institutionId);
    if (exists) await studentRepo.unFollowInstitution(studentData._id, institutionId);
    else await studentRepo.followInstitution(student.subModel, institutionId);
  } else {
    studentData.followedInstitutions = [institutionId];
    await studentRepo.updateById(studentData._id, studentData);
  }
}

async function getFollowedCompanyUseCase(userId) {
  let student = await userRepo.findByIdWithoutPopulate(userId);
  return await studentRepo.getFollowedCompany(student.subModel);
}

async function getSavedJobsUseCase(userId, populate) {
  let student = await userRepo.findByIdWithoutPopulate(userId);
  return await studentRepo.getSavedJobs(student.subModel, populate);
}

async function getMentorSessionsUseCase(studentId, status, paginationQuery) {
  return await meetingRepo.findByStudent(studentId, status, paginationQuery);
}

async function getCompaniesThatHiresFromStudentsInstitutionUseCase(userId, paginationQuery) {
  let student = await userRepo.findByIdWithoutPopulate(userId);
  return await studentRepo.getCompaniesThatHiresFromStudentsInstitution(student.subModel, paginationQuery);
}
// get students by major id
async function getStudentsByMajorIdUseCase(majorId) {
  return await studentRepo.getStudentsByMajorId(majorId);
}

// get applications by student id
async function getApplicationsByUser(userId, paginationQuery) {
  return await applicationRepo.getApplicationsByUser(userId, paginationQuery);
}

async function getMentorshipSessionByStudentUseCase(studentId, query) {
  return await meetingRepo.findByStudentOnGoingSessions(studentId, query);
}

export default {
  createStudentUseCase,
  getStudentByIdUseCase,
  getStudentsUseCase,
  updateStudentByIdUseCase,
  updateCareerInterestUseCase,
  addjobMajorUseCase,
  saveJobUseCase,
  followCompanyUseCase,
  getSavedJobsUseCase,
  getFollowedCompanyUseCase,
  requestMentorUseCase,
  getMentorSessionsUseCase,
  getCompaniesThatHiresFromStudentsInstitutionUseCase,
  getStudentsByMajorIdUseCase,
  followInstitutionUseCase,
  getApplicationsByUser,
  getMentorshipSessionByStudentUseCase,
};
