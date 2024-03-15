import { successfullyCreatedResponse, successfulResponse } from "../helper/response-formatter.js";
import { appStateUseCase } from "../use-cases/index.js";

async function addAppState(httpRequest) {
  const newAppState = await appStateUseCase.addAppStateUseCase(httpRequest.body);
  return successfullyCreatedResponse(newAppState);
}
async function getAppStates() {
  return successfulResponse(await appStateUseCase.getAppStatesUseCase());
}
async function getAppStateById(httpRequest) {
  return successfulResponse(await appStateUseCase.getAppStateByIdUseCase(httpRequest.params));
}
async function updateAppState(httpRequest) {
  const updatedAppState = await appStateUseCase.updateAppStateUseCase();
  return successfulResponse(updatedAppState);
}

export default { addAppState, getAppStates, getAppStateById, updateAppState };
