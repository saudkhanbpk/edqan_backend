import currencyModel from "../models/currency.model.js";

async function findAll() {
  return await currencyModel.find().sort({ order: 1 }).lean();
}
async function findById(currencyId) {
  return await currencyModel.findById(currencyId).lean();
}
async function updateById(currencyId, updatedCurrencyInfo) {
  return await currencyModel.findByIdAndUpdate(currencyId, updatedCurrencyInfo, { new: true, runValidators: true }).lean();
}
async function insert(currencyInfo) {
  const newCurrency = new currencyModel(currencyInfo);
  await newCurrency.save();
  return newCurrency;
}
async function removeCurrencyById(CurrencyId) {
  await currencyModel.deleteOne({ _id: CurrencyId });
  return;
}

export default { findAll, insert, findById, updateById, removeCurrencyById };
