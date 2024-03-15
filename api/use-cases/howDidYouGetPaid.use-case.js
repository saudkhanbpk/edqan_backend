import { howDidYouGetPaidRepo } from "../data-access-layer/index.js";
import { makeHowDidYouGetPaid } from "../entities/index.js";

async function createHowDidYouGetPaidUseCase(howDidYouGetPaidInfo) {
  const newHowDidYouGetPaid = await makeHowDidYouGetPaid(howDidYouGetPaidInfo);
  return await howDidYouGetPaidRepo.insert(newHowDidYouGetPaid);
}

async function getHowDidYouGetPaidUseCase() {
  return await howDidYouGetPaidRepo.findAll();
}

async function getHowDidYouGetPaidByIdUseCase(howDidYouGetPaidId) {
  return await howDidYouGetPaidRepo.findById(howDidYouGetPaidId);
}

async function deleteHowDidYouGetPaidByIdUseCase(howDidYouGetPaidId) {
  return await howDidYouGetPaidRepo.deleteHowDidYouGetPaidById(howDidYouGetPaidId);
}

async function getHowDidYouGetPaidByNameUseCase(howDidYouGetPaidName) {
  return await howDidYouGetPaidRepo.findByName(howDidYouGetPaidName);
}

async function updateHowDidYouGetPaidByIdUseCase(howDidYouGetPaidId, howDidYouGetPaidInfo) {
  return await howDidYouGetPaidRepo.updateById(howDidYouGetPaidId, howDidYouGetPaidInfo);
}

export default {
  createHowDidYouGetPaidUseCase,
  getHowDidYouGetPaidUseCase,
  getHowDidYouGetPaidByIdUseCase,
  updateHowDidYouGetPaidByIdUseCase,
  getHowDidYouGetPaidByNameUseCase,
  deleteHowDidYouGetPaidByIdUseCase,
};
