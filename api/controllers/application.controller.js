import { fileUploadService, fileMimeType } from "../helper/fileUploadService.js";
import { applicationUseCase } from "../use-cases/index.js";
import { successfullyCreatedResponse, successfulResponse } from "../helper/response-formatter.js";

async function createApplication(httpRequest) {
  let attachment;
  attachment = await fileUploadService(httpRequest.originalReqObject, "attachments", ["cvPath", "coverLetterPath"], true, fileMimeType.PDF);
  attachment.user = httpRequest.user._id;
  const newApplication = await applicationUseCase.createApplicationUseCase(httpRequest.query.userId, attachment);
  return successfullyCreatedResponse(newApplication);
}
async function getApplications(httpRequest) {
  return successfulResponse(await applicationUseCase.getApplicationsUseCase(httpRequest.params.userId, httpRequest.query, httpRequest.query));
}
async function getApplicationById(httpRequest) {
  return successfulResponse(await applicationUseCase.getApplicationByIdUseCase(httpRequest.params._id));
}
async function updateApplicationById(httpRequest) {
  return successfulResponse(await applicationUseCase.updateApplicationByIdUseCase(httpRequest.params._id, httpRequest.body));
}
async function getApplicationByJobId(httpRequest) {
  return successfulResponse(
    await applicationUseCase.getApplicationByJobIdUseCase(httpRequest.params.jobId, httpRequest.query, httpRequest.paginationQuery)
  );
}

export default { createApplication, getApplicationById, getApplications, updateApplicationById, getApplicationByJobId };
