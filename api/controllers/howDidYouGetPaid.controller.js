import { successfullyCreatedResponse, successfulResponse } from "../helper/response-formatter.js";
import { howDidYouGetPaidUseCase } from "../use-cases/index.js";

async function createHowDidYouGetPaid(httpRequest) {
  const newHowDidYouGetPaid = await howDidYouGetPaidUseCase.createHowDidYouGetPaidUseCase(httpRequest.body);
  return successfullyCreatedResponse(newHowDidYouGetPaid);
}
async function getHowDidYouGetPaid(httpRequest) {
  return httpRequest.query.name
    ? successfulResponse(await howDidYouGetPaidUseCase.getHowDidYouGetPaidByNameUseCase(httpRequest.query.name))
    : successfulResponse(await howDidYouGetPaidUseCase.getHowDidYouGetPaidUseCase());
}
async function getHowDidYouGetPaidById(httpRequest) {
  return successfulResponse(await howDidYouGetPaidUseCase.getHowDidYouGetPaidByIdUseCase(httpRequest.params._id));
}
async function deleteHowDidYouGetPaidById(httpRequest) {
  return successfulResponse(await howDidYouGetPaidUseCase.deleteHowDidYouGetPaidByIdUseCase(httpRequest.params._id));
}
async function updateHowDidYouGetPaidById(httpRequest) {
  return successfulResponse(await howDidYouGetPaidUseCase.updateHowDidYouGetPaidByIdUseCase(httpRequest.params._id, httpRequest.body));
}

export default { createHowDidYouGetPaid, getHowDidYouGetPaidById, getHowDidYouGetPaid, updateHowDidYouGetPaidById, deleteHowDidYouGetPaidById };
