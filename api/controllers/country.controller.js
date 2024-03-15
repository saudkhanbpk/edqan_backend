import { successfullyCreatedResponse, successfulResponse } from "../helper/response-formatter.js";
import { countryUseCase } from "../use-cases/index.js";

async function createCountry(httpRequest) {
  const newCountry = await countryUseCase.createCountryUseCase(httpRequest.body);
  return successfullyCreatedResponse(newCountry);
}
async function getCountrys(httpRequest) {
  return successfulResponse(await countryUseCase.getCountrysUseCase(httpRequest.query));
}
async function getCountryById(httpRequest) {
  return successfulResponse(await countryUseCase.getCountryByIdUseCase(httpRequest.params._id));
}
async function updateCountryById(httpRequest) {
  return successfulResponse(await countryUseCase.updateCountryByIdUseCase(httpRequest.params._id, httpRequest.body));
}
async function removeCountryById(httpRequest) {
  return successfulResponse(await countryUseCase.removeCountryByIdUseCase(httpRequest.params._id));
}

export default { createCountry, getCountryById, getCountrys, updateCountryById, removeCountryById };
