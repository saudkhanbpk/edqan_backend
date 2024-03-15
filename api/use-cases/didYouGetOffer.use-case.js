import { didYouGetOfferRepo } from "../data-access-layer/index.js";
import { makeDidYouGetOffer } from "../entities/index.js";

async function createDidYouGetOfferUseCase(didYouGetOfferInfo) {
  const newDidYouGetOffer = await makeDidYouGetOffer(didYouGetOfferInfo);
  return await didYouGetOfferRepo.insert(newDidYouGetOffer);
}

async function getDidYouGetOffersUseCase(didYouGetOfferInfo) {
  return await didYouGetOfferRepo.findAll();
}

async function getDidYouGetOfferByIdUseCase(didYouGetOfferId) {
  return await didYouGetOfferRepo.findById(didYouGetOfferId);
}

async function deleteDidYouGetOfferByIdUseCase(didYouGetOfferId) {
  return await didYouGetOfferRepo.deleteDidYouGetOfferById(didYouGetOfferId);
}

async function getDidYouGetOfferByNameUseCase(didYouGetOfferName) {
  return await didYouGetOfferRepo.findByName(didYouGetOfferName);
}

async function updateDidYouGetOfferByIdUseCase(didYouGetOfferId, didYouGetOfferInfo) {
  return await didYouGetOfferRepo.updateById(didYouGetOfferId, didYouGetOfferInfo);
}

export default {
  createDidYouGetOfferUseCase,
  getDidYouGetOffersUseCase,
  getDidYouGetOfferByIdUseCase,
  updateDidYouGetOfferByIdUseCase,
  getDidYouGetOfferByNameUseCase,
  deleteDidYouGetOfferByIdUseCase,
};
