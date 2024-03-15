import { successfullyCreatedResponse, successfulResponse } from "../helper/response-formatter.js";
import { educationLevelGroupUseCase } from "../use-cases/index.js";

async function createEducationLevelGroup(httpRequest) {
  const newEducationLevelGroup = await educationLevelGroupUseCase.createEducationLevelGroupUseCase(httpRequest.body);
  return successfullyCreatedResponse(newEducationLevelGroup);
}
async function getEducationLevelGroups(httpRequest) {
  return httpRequest.query.name
    ? successfulResponse(await educationLevelGroupUseCase.getEducationLevelGroupByNameUseCase(httpRequest.query.name))
    : successfulResponse(await educationLevelGroupUseCase.getEducationLevelGroupsUseCase());
}
async function getEducationLevelGroupById(httpRequest) {
  return successfulResponse(await educationLevelGroupUseCase.getEducationLevelGroupByIdUseCase(httpRequest.params._id));
}
async function getEducationLevelGroupByEducationLevel(httpRequest) {
  return successfulResponse(await educationLevelGroupUseCase.getEducationLevelGroupByEducationLvlIdUseCase(httpRequest.params.educationLevelGroupId));
}
async function updateEducationLevelGroupById(httpRequest) {
  return successfulResponse(await educationLevelGroupUseCase.updateEducationLevelGroupByIdUseCase(httpRequest.params._id, httpRequest.body));
}

export default {
  createEducationLevelGroup,
  getEducationLevelGroupById,
  getEducationLevelGroups,
  updateEducationLevelGroupById,
  getEducationLevelGroupByEducationLevel,
};
