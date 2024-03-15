import { provinceRepo } from "../data-access-layer/index.js";
import { makeProvince } from "../entities/index.js";

async function createProvinceUseCase(provinceInfo) {
  const newCountry = await makeProvince(provinceInfo);
  return await provinceRepo.insert(newCountry);
}

async function getProvincesUseCase(query) {
  return await provinceRepo.findAll(query);
}

async function getProvinceByIdUseCase(provinceId) {
  return await provinceRepo.findById(provinceId);
}

async function updateProvinceByIdUseCase(provinceId, provinceInfo) {
  return await provinceRepo.updateById(provinceId, provinceInfo);
}

async function removeProvinceByIdUseCase(provinceId) {
  return await provinceRepo.removeProvinceById(provinceId);
}

async function getProvinceByCountryUseCase(country, paginationQuery) {
  //check if paginationQuery contains page and pageSize
  if (!paginationQuery.page || !paginationQuery.pageSize) {
    paginationQuery = false;
  }
  return await provinceRepo.findByCountry(country, paginationQuery);
}

export default {
  createProvinceUseCase,
  getProvinceByIdUseCase,
  getProvincesUseCase,
  updateProvinceByIdUseCase,
  removeProvinceByIdUseCase,
  getProvinceByCountryUseCase,

};
