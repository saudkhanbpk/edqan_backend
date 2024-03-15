import { countryRepo } from "../data-access-layer/index.js";
import { makeCountry } from "../entities/index.js";

async function createCountryUseCase(countryInfo) {
  const newCountry = await makeCountry(countryInfo);
  return await countryRepo.insert(newCountry);
}

async function getCountrysUseCase(query) {
  return await countryRepo.findAll(query);
}

async function getCountryByIdUseCase(countryId) {
  return await countryRepo.findById(countryId);
}

async function updateCountryByIdUseCase(countryId, countryInfo) {
  return await countryRepo.updateById(countryId, countryInfo);
}

async function removeCountryByIdUseCase(countryId) {
  return await countryRepo.removeCountryById(countryId);
}

export default {
  createCountryUseCase,
  getCountrysUseCase,
  getCountryByIdUseCase,
  updateCountryByIdUseCase,
  removeCountryByIdUseCase,
};
