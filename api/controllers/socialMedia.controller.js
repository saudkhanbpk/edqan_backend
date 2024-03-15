import { successfullyCreatedResponse, successfulResponse } from "../helper/response-formatter.js";
import { socialMediaUseCase } from "../use-cases/index.js";

async function createSocialMedia(httpRequest) {
  const newSocialMedia = await socialMediaUseCase.createSocialMediaUseCase(httpRequest.body);
  return successfullyCreatedResponse(newSocialMedia);
}
async function getSocialMedias(httpRequest) {
  return httpRequest.query.name
    ? successfulResponse(await socialMediaUseCase.getSocialMediaByNameUseCase(httpRequest.query.name))
    : successfulResponse(await socialMediaUseCase.getSocialMediasUseCase());
}
async function deleteSocialMediaById(httpRequest) {
  return successfulResponse(await socialMediaUseCase.deleteSocialMediaByIdUseCase(httpRequest.params._id));
}
async function getSocialMediaById(httpRequest) {
  return successfulResponse(await socialMediaUseCase.getSocialMediaByIdUseCase(httpRequest.params._id));
}
async function updateSocialMediaById(httpRequest) {
  return successfulResponse(await socialMediaUseCase.updateSocialMediaByIdUseCase(httpRequest.params._id, httpRequest.body));
}

export default { createSocialMedia, getSocialMediaById, getSocialMedias, updateSocialMediaById, deleteSocialMediaById };
