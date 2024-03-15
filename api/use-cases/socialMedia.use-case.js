import { socialMediaRepo } from "../data-access-layer/index.js";
import { makeSocialMedia } from "../entities/index.js";

async function createSocialMediaUseCase(socialMediaInfo) {
  const newSocialMedia = await makeSocialMedia(socialMediaInfo);
  return await socialMediaRepo.insert(newSocialMedia);
}

async function getSocialMediasUseCase(socialMediaInfo) {
  return await socialMediaRepo.findAll();
}

async function getSocialMediaByIdUseCase(socialMediaId) {
  return await socialMediaRepo.findById(socialMediaId);
}

async function deleteSocialMediaByIdUseCase(socialMediaId) {
  return await socialMediaRepo.deleteSocialMediaById(socialMediaId);
}

async function getSocialMediaByNameUseCase(socialMediaName) {
  return await socialMediaRepo.findByName(socialMediaName);
}

async function updateSocialMediaByIdUseCase(socialMediaId, socialMediaInfo) {
  return await socialMediaRepo.updateById(socialMediaId, socialMediaInfo);
}

export default {
  createSocialMediaUseCase,
  getSocialMediaByIdUseCase,
  getSocialMediasUseCase,
  updateSocialMediaByIdUseCase,
  getSocialMediaByNameUseCase,
  deleteSocialMediaByIdUseCase,
};
