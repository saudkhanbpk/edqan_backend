import { successfullyCreatedResponse, successfulResponse } from "../helper/response-formatter.js";
import { reviewUseCase } from "../use-cases/index.js";

async function createReview(httpRequest) {
  const newReview = await reviewUseCase.createReviewUseCase(httpRequest.body);
  return successfullyCreatedResponse(newReview);
}
async function getReviews(httpRequest) {
  if (httpRequest.user) httpRequest.query.approved = 'approved';
  return successfulResponse(await reviewUseCase.getReviewsUseCase(httpRequest.query, httpRequest.paginationQuery));
}
async function getReviewById(httpRequest) {
  return successfulResponse(await reviewUseCase.getReviewByIdUseCase(httpRequest.params._id));
}
async function updateReviewById(httpRequest) {
  // if (httpRequest.user) httpRequest.body.approved = false;
  return successfulResponse(await reviewUseCase.updateReviewByIdUseCase(httpRequest.params._id, httpRequest.body));
}

export default { createReview, getReviewById, getReviews, updateReviewById };
