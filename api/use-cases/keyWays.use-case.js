import { keyWaysRepo } from "../data-access-layer/index.js";
import { makeKeyWays } from "../entities/index.js";

async function createKeyWaysUseCase(keyWaysInfo) {
  const newKeyWays = await makeKeyWays(keyWaysInfo);
  return await keyWaysRepo.insert(newKeyWays);
}

async function getKeyWayssUseCase(keyWaysInfo) {
  return await keyWaysRepo.findAll();
}

async function getKeyWaysByIdUseCase(keyWaysId) {
  return await keyWaysRepo.findById(keyWaysId);
}

async function updateKeyWaysByIdUseCase(keyWaysId, keyWaysInfo) {
  return await keyWaysRepo.updateById(keyWaysId, keyWaysInfo);
}

async function removeKeyWaysByIdUseCase(keyWaysId) {
  return await keyWaysRepo.removeKeyWaysById(keyWaysId);
}

export default {
  createKeyWaysUseCase,
  getKeyWayssUseCase,
  getKeyWaysByIdUseCase,
  updateKeyWaysByIdUseCase,
  removeKeyWaysByIdUseCase,
};
