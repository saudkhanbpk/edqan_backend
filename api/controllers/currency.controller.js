import { successfullyCreatedResponse, successfulResponse } from "../helper/response-formatter.js";
import { currencyUseCase } from "../use-cases/index.js";
async function createCurrency(httpRequest) {
  const newCurrency = await currencyUseCase.createCurrencyUseCase(httpRequest.body);
  return successfullyCreatedResponse(newCurrency);
}
async function getCurrencys() {
  return successfulResponse(await currencyUseCase.getCurrencysUseCase());
}
async function getCurrencyById(httpRequest) {
  return successfulResponse(await currencyUseCase.getCurrencyByIdUseCase(httpRequest.params._id));
}
async function updateCurrencyById(httpRequest) {
  return successfulResponse(await currencyUseCase.updateCurrencyByIdUseCase(httpRequest.params._id, httpRequest.body));
}
async function removeCurrencyById(httpRequest) {
  return successfulResponse(await currencyUseCase.removeCurrencyByIdUseCase(httpRequest.params._id));
}

export default { createCurrency, getCurrencyById, getCurrencys, updateCurrencyById, removeCurrencyById };
