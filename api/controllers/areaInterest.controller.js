import { successfullyCreatedResponse, successfulResponse } from "../helper/response-formatter.js";
import { areaInterestUseCase } from "../use-cases/index.js";

async function createAreaInterest(httpRequest) {
  const newAreaInterest = await areaInterestUseCase.createAreaInterestUseCase(httpRequest.body);
  return successfullyCreatedResponse(newAreaInterest);
}
async function getAreaInterests(httpRequest) {
  return successfulResponse(await areaInterestUseCase.getAreaInterestsUseCase(httpRequest.query));
}
async function getAreaInterestById(httpRequest) {
  return successfulResponse(await areaInterestUseCase.getAreaInterestByIdUseCase(httpRequest.params._id));
}
async function updateAreaInterestById(httpRequest) {
  return successfulResponse(await areaInterestUseCase.updateAreaInterestByIdUseCase(httpRequest.params._id, httpRequest.body));
}
async function removeAreaInterestById(httpRequest) {
  return successfulResponse(await areaInterestUseCase.removeAreaInterestByIdUseCase(httpRequest.params._id));
}

export default { createAreaInterest, getAreaInterestById, getAreaInterests, updateAreaInterestById, removeAreaInterestById };
