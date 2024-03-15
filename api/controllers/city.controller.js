import { successfullyCreatedResponse, successfulResponse } from "../helper/response-formatter.js";
import { cityUseCase } from "../use-cases/index.js";

async function createCity(httpRequest) {
  const newCity = await cityUseCase.createCityUseCase(httpRequest.body);
  return successfullyCreatedResponse(newCity);
}
async function getCitys(httpRequest) {
  return successfulResponse(await cityUseCase.getCitysUseCase(httpRequest.query));
}
async function getCityById(httpRequest) {
  return successfulResponse(await cityUseCase.getCityByIdUseCase(httpRequest.params._id));
}
async function getCityByCountry(httpRequest) {
  return successfulResponse(await cityUseCase.getCityByCountryUseCase(httpRequest.params.countryId, httpRequest.query));
}
async function updateCityById(httpRequest) {
  return successfulResponse(await cityUseCase.updateCityByIdUseCase(httpRequest.params._id, httpRequest.body));
}
async function removeCityById(httpRequest) {
  return successfulResponse(await cityUseCase.removeCityByIdUseCase(httpRequest.params._id));
}

export default { createCity, getCityById, getCitys, updateCityById, removeCityById, getCityByCountry };
