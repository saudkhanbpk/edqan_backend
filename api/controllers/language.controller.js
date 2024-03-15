import { successfullyCreatedResponse, successfulResponse } from "../helper/response-formatter.js";
import { languageUseCase } from "../use-cases/index.js";
async function createLanguage(httpRequest) {
  const newLanguage = await languageUseCase.createLanguageUseCase(httpRequest.body);
  return successfullyCreatedResponse(newLanguage);
}
async function getLanguages(httpRequest) {
  return successfulResponse(await languageUseCase.getLanguagesUseCase(httpRequest.query));
}
async function getLanguageById(httpRequest) {
  return successfulResponse(await languageUseCase.getLanguageByIdUseCase(httpRequest.params._id));
}
async function updateLanguageById(httpRequest) {
  return successfulResponse(await languageUseCase.updateLanguageByIdUseCase(httpRequest.params._id, httpRequest.body));
}
async function removeLanguageById(httpRequest) {
  return successfulResponse(await languageUseCase.removeLanguageByIdUseCase(httpRequest.params._id));
}

export default { createLanguage, getLanguageById, getLanguages, updateLanguageById, removeLanguageById };
