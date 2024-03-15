import { appStateRepo } from "../data-access-layer/index.js";
import { makeAppState } from "../entities/index.js";

async function addAppStateUseCase(appStateInfo) {
  let existingAppStates = await getAppStatesUseCase();
  if (existingAppStates.length > 0) throw new Error("Invalid app state data");
  const appState = makeAppState(appStateInfo);
  return await appStateRepo.insert(appState);
}

async function getAppStatesUseCase() {
  let states = await appStateRepo.findAll();
  return states[0];
}

async function getAppStateByIdUseCase(appStateId) {
  return await appStateRepo.findById(appStateId);
}

async function updateAppStateUseCase() {
  let existingAppState = await appStateRepo.findAll();
  existingAppState = existingAppState[0];

  return await appStateRepo.updateById(existingAppState._id, { inMaintenance: !existingAppState.inMaintenance });
}

export default {
  addAppStateUseCase,
  getAppStatesUseCase,
  getAppStateByIdUseCase,
  updateAppStateUseCase,
};
