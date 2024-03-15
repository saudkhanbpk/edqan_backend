import { successfullyCreatedResponse, successfulResponse } from "../helper/response-formatter.js";
import { reviewOptionsUseCase } from "../use-cases/index.js";

async function createReviewOptions(httpRequest) {
  const newReviewOptions = await reviewOptionsUseCase.createReviewOptionsUseCase(httpRequest.body);
  return successfullyCreatedResponse(newReviewOptions);
}
async function getReviewOptionss() {
  return successfulResponse(await reviewOptionsUseCase.getReviewOptionssUseCase());
}
async function getReviewOptionsById(httpRequest) {
  return successfulResponse(await reviewOptionsUseCase.getReviewOptionsByIdUseCase(httpRequest.params._id));
}
async function updateReviewOptionsById(httpRequest) {
  return successfulResponse(await reviewOptionsUseCase.updateReviewOptionsByIdUseCase(httpRequest.params._id, httpRequest.body));
}

export default { createReviewOptions, getReviewOptionsById, getReviewOptionss, updateReviewOptionsById };
