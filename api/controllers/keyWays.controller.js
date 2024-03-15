import { successfullyCreatedResponse, successfulResponse } from "../helper/response-formatter.js";
import { keyWaysUseCase } from "../use-cases/index.js";

async function createKeyWays(httpRequest) {
  const newKeyWays = await keyWaysUseCase.createKeyWaysUseCase(httpRequest.body);
  return successfullyCreatedResponse(newKeyWays);
}
async function getKeyWayss() {
  return successfulResponse(await keyWaysUseCase.getKeyWayssUseCase());
}
async function getKeyWaysById(httpRequest) {
  return successfulResponse(await keyWaysUseCase.getKeyWaysByIdUseCase(httpRequest.params._id));
}
async function updateKeyWaysById(httpRequest) {
  return successfulResponse(await keyWaysUseCase.updateKeyWaysByIdUseCase(httpRequest.params._id, httpRequest.body));
}
async function removeKeyWaysById(httpRequest) {
  return successfulResponse(await keyWaysUseCase.removeKeyWaysByIdUseCase(httpRequest.params._id));
}

export default { createKeyWays, getKeyWaysById, getKeyWayss, updateKeyWaysById, removeKeyWaysById };
