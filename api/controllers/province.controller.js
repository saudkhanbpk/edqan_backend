import { successfullyCreatedResponse, successfulResponse } from "../helper/response-formatter.js";
import { provinceUserCase } from "../use-cases/index.js";

async function createProvince(httpRequest) {
  const newCountry = await provinceUserCase.createProvinceUseCase(httpRequest.body);
  return successfullyCreatedResponse(newCountry);
}
async function getProvinces(httpRequest) {
  return successfulResponse(await provinceUserCase.getProvincesUseCase(httpRequest.query));
}
async function getProvinceById(httpRequest) {
  return successfulResponse(await provinceUserCase.getProvinceByIdUseCase(httpRequest.params._id));
}
async function updateProvinceById(httpRequest) {
  return successfulResponse(await provinceUserCase.updateProvinceByIdUseCase(httpRequest.params._id, httpRequest.body));
}
async function removeProvinceById(httpRequest) {
  return successfulResponse(await provinceUserCase.removeProvinceByIdUseCase(httpRequest.params._id));
}
async function getProvinceByCountry(httpRequest) {
  return successfulResponse(await provinceUserCase.getProvinceByCountryUseCase(httpRequest.params.countryId, httpRequest.query));
}

export default { createProvince, getProvinceById, getProvinces, updateProvinceById, removeProvinceById, getProvinceByCountry };
