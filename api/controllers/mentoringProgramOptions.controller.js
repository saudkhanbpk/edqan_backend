import { successfullyCreatedResponse, successfulResponse } from "../helper/response-formatter.js";
import { mentoringProgramOptionsUseCase } from "../use-cases/index.js";

async function createMentoringProgramOptions(httpRequest) {
  const newMentoringProgramOptions = await mentoringProgramOptionsUseCase.createMentoringProgramOptionsUseCase(httpRequest.body);
  return successfullyCreatedResponse(newMentoringProgramOptions);
}
async function getMentoringProgramOptions(httpRequest) {
  return httpRequest.query.name
    ? successfulResponse(await mentoringProgramOptionsUseCase.getMentoringProgramOptionsByNameUseCase(httpRequest.query.name))
    : successfulResponse(await mentoringProgramOptionsUseCase.getMentoringProgramOptionsUseCase());
}
async function getMentoringProgramOptionsById(httpRequest) {
  return successfulResponse(await mentoringProgramOptionsUseCase.getMentoringProgramOptionsByIdUseCase(httpRequest.params._id));
}
async function deleteMentoringProgramOptionsById(httpRequest) {
  return successfulResponse(await mentoringProgramOptionsUseCase.deleteMentoringProgramOptionsByIdUseCase(httpRequest.params._id));
}
async function updateMentoringProgramOptionsById(httpRequest) {
  return successfulResponse(await mentoringProgramOptionsUseCase.updateMentoringProgramOptionsByIdUseCase(httpRequest.params._id, httpRequest.body));
}

export default {
  createMentoringProgramOptions,
  getMentoringProgramOptionsById,
  getMentoringProgramOptions,
  updateMentoringProgramOptionsById,
  deleteMentoringProgramOptionsById,
};
