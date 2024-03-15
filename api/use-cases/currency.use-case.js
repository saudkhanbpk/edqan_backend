import { currencyRepo } from "../data-access-layer/index.js";
import { makeCurrency } from "../entities/index.js";

async function createCurrencyUseCase(currencyInfo) {
  const newCurrency = await makeCurrency(currencyInfo);
  return await currencyRepo.insert(newCurrency);
}

async function getCurrencysUseCase(currencyInfo) {
  return await currencyRepo.findAll();
}

async function getCurrencyByIdUseCase(currencyId) {
  return await currencyRepo.findById(currencyId);
}

async function updateCurrencyByIdUseCase(currencyId, currencyInfo) {
  return await currencyRepo.updateById(currencyId, currencyInfo);
}

async function removeCurrencyByIdUseCase(currencyId) {
  return await currencyRepo.removeCurrencyById(currencyId);
}

export default {
  createCurrencyUseCase,
  getCurrencysUseCase,
  getCurrencyByIdUseCase,
  updateCurrencyByIdUseCase,
  removeCurrencyByIdUseCase,
};
