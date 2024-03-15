import { successfulResponse } from "../helper/response-formatter.js";
import { userNotificationsUseCase } from "../use-cases/index.js";

async function getUserNotificationss(httpRequest) {
  return successfulResponse(
    await userNotificationsUseCase.getUserNotificationssUseCase(httpRequest.query.userId, httpRequest.query.status, httpRequest.paginationQuery)
  );
}
async function updateUserNotificationsStatus(httpRequest) {
  return successfulResponse(await userNotificationsUseCase.updateUserNotificationsStatusUseCase(httpRequest.params.userId));
}

export default { getUserNotificationss, updateUserNotificationsStatus };
