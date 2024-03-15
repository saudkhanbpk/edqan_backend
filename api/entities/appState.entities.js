import { toBoolean } from "../helper/helper.js";

function makeAppState({ inMaintenance }) {
  //#region inMaintenance validation
  inMaintenance = toBoolean(inMaintenance);
  //#endregion inMaintenance validation

  return Object.freeze({
    inMaintenance,
  });
}

export default makeAppState;
