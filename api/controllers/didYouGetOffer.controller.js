import { successfullyCreatedResponse, successfulResponse } from "../helper/response-formatter.js";
import { didYouGetOfferUseCase } from "../use-cases/index.js";

async function createDidYouGetOffer(httpRequest) {
  const newDidYouGetOffer = await didYouGetOfferUseCase.createDidYouGetOfferUseCase(httpRequest.body);
  return successfullyCreatedResponse(newDidYouGetOffer);
}
async function getDidYouGetOffers(httpRequest) {
  return httpRequest.query.name
    ? successfulResponse(await didYouGetOfferUseCase.getDidYouGetOfferByNameUseCase(httpRequest.query.name))
    : successfulResponse(await didYouGetOfferUseCase.getDidYouGetOffersUseCase());
}
async function getDidYouGetOfferById(httpRequest) {
  return successfulResponse(await didYouGetOfferUseCase.getDidYouGetOfferByIdUseCase(httpRequest.params._id));
}
async function deleteDidYouGetOfferById(httpRequest) {
  return successfulResponse(await didYouGetOfferUseCase.deleteDidYouGetOfferByIdUseCase(httpRequest.params._id));
}
async function updateDidYouGetOfferById(httpRequest) {
  return successfulResponse(await didYouGetOfferUseCase.updateDidYouGetOfferByIdUseCase(httpRequest.params._id, httpRequest.body));
}

export default { createDidYouGetOffer, getDidYouGetOfferById, getDidYouGetOffers, updateDidYouGetOfferById, deleteDidYouGetOfferById };
