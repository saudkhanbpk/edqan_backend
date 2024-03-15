import { cityRepo } from "../data-access-layer/index.js";
import { makeCity } from "../entities/index.js";

async function createCityUseCase(cityInfo) {
  const newCity = await makeCity(cityInfo);
  return await cityRepo.insert(newCity);
}

async function getCitysUseCase(paginationQuery) {
  return await cityRepo.findAll(paginationQuery);
}

async function getCityByIdUseCase(cityId) {
  return await cityRepo.findById(cityId);
}

async function getCityByCountryUseCase(country, paginationQuery) {
  //check if paginationQuery contains page and pageSize
  if (!paginationQuery.page || !paginationQuery.pageSize) {
    paginationQuery = false;
  }
  return await cityRepo.findByCountry(country, paginationQuery);
}

async function updateCityByIdUseCase(cityId, cityInfo) {
  return await cityRepo.updateById(cityId, cityInfo);
}

async function removeCityByIdUseCase(cityId) {
  return await cityRepo.removeCityById(cityId);
}

export default {
  createCityUseCase,
  getCitysUseCase,
  getCityByIdUseCase,
  updateCityByIdUseCase,
  removeCityByIdUseCase,
  getCityByCountryUseCase,
};
