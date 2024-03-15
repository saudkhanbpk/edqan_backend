import { successfulResponse } from "../helper/response-formatter.js";
import { fileUploadService, fileMimeType } from "../helper/fileUploadService.js";
import { hashPassword } from "../helper/password-hash.js";
import ExcelJS from "exceljs";
import mongoose from "mongoose";

import {institutionUseCase} from "../use-cases/index.js";
async function uploadStudentsFromExcel(httpRequest) {
  let filePath = await fileUploadService(httpRequest.originalReqObject, "excelFiles", "excel", true, fileMimeType.EXCEL_XLSX);

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(__dirname + "/" + filePath.excel.split(`${process.env.SERVER_URL}`)[1]);
  const worksheet = workbook.getWorksheet(1);

  const users = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
      // Skip the header row
      return;
    }
    const user = {
      _id: new mongoose.Types.ObjectId(),
      firstName: row.getCell("A").text,
      middleName: row.getCell("B").text,
      lastName: row.getCell("C").text,
      email: row.getCell("D").text,
      institution: httpRequest.user._id,
      model: "Student",
      gender: row.getCell("E").text,
      password: row.getCell("F").text,
      subModel: new mongoose.Types.ObjectId(),
    };

    users.push(user);
  });

  // Hash passwords asynchronously
  const hashedUsers = await Promise.all(
    users.map(async (user) => {
      user.password = await hashPassword(user.password);
      user.user = user._id;
      return user;
    })
  );
  await addStudents(hashedUsers);
  return successfulResponse();
}
async function getExcelSheet() {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  worksheet.columns = [
    { header: "First Name", key: "firstName", width: 15 },
    { header: "Middle Name", key: "middleName", width: 15 },
    { header: "Last Name", key: "lastName", width: 15 },
    { header: "email", key: "email", width: 20 },
    {
      header: "Gender",
      key: "gender",
      width: 10,
      dataValidation: {
        type: "list",
        allowBlank: true,
        formulae: ['"Male,Female,Other"'],
      },
    },
    { header: "Password", key: "password", width: 15 },
  ];
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}
async function getInstitutions(httpRequest) {
  return successfulResponse(await institutionUseCase.getInstitutionsUseCase(httpRequest.query));
}
async function getInstitutionStudents(httpRequest) {
  return successfulResponse(await institutionUseCase.getInstitutionStudentsUseCase(httpRequest.params._id,httpRequest.query,httpRequest.paginationQuery));
}
async function getInstitutionById(httpRequest) {
  return successfulResponse(await institutionUseCase.getInstitutionByIdUseCase(httpRequest.params._id));
}
async function updateInstitutionById(httpRequest) {
  let attachment = await fileUploadService(httpRequest.originalReqObject, "SchoolLogosAndBanners", ["logo", "banner"], true, fileMimeType.IMAGE);
  return successfulResponse(await institutionUseCase.updateInstitutionByIdUseCase(httpRequest.params._id, attachment));
}
async function getNumberOfStudentsWhoFollowedInstitution(httpRequest) {
  const numberOfUsers = await institutionUseCase.getNumberOfStudentsWhoFollowedInstitution(httpRequest.params._id);
  return successfulResponse(numberOfUsers);
}
async function getNumberOfDistinctUsersWhoViewedAProfileInTimeRange(httpRequest) {
  const numberOfUsers = await institutionUseCase.findAllUsersWhoViewedAProfileUseCase(httpRequest.params._id, httpRequest.query);
  return successfulResponse(numberOfUsers);
}
async function getNumberOfStudentsHiredByCompany(httpRequest) {
  const numberOfUsers = await institutionUseCase.getNumberOfStudentsHiredByCompanyUseCase(httpRequest.params._id);
  return successfulResponse(numberOfUsers);
}

async function getInstitutionApplications(httpRequest) {
  const users = await institutionUseCase.getInstitutionApplicationsUseCase(httpRequest.params._id,httpRequest.paginationQuery);
  return successfulResponse(users);
}

async function getInstitutionApplicationsHired(httpRequest) {
  const users = await institutionUseCase.getInstitutionApplicationsHiredUseCase(httpRequest.params._id,httpRequest.paginationQuery);
  return successfulResponse(users);
}

async function findMentorshipSessionByInstitution(httpRequest) {
  const users = await institutionUseCase.findMentorshipSessionByInstitutionUseCase(httpRequest.params._id,httpRequest.paginationQuery);
  return successfulResponse(users);
}

async function findMentorshipSessionByInstitutionOngoing(httpRequest) {
  const users = await institutionUseCase.findMentorshipSessionByInstitutionOngoingUseCase(httpRequest.params._id,httpRequest.paginationQuery);
  return successfulResponse(users);
}

export default {
  getInstitutionById,
  getInstitutions,
  updateInstitutionById,
  getInstitutionStudents,
  getNumberOfStudentsWhoFollowedInstitution,
  getNumberOfDistinctUsersWhoViewedAProfileInTimeRange,
  uploadStudentsFromExcel,
  getExcelSheet,
  getNumberOfStudentsHiredByCompany,
  getInstitutionApplications,
  getInstitutionApplicationsHired,
  findMentorshipSessionByInstitution,
  findMentorshipSessionByInstitutionOngoing
};
