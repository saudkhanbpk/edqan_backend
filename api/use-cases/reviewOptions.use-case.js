let reviewOptionsRepo = null;

async function createReviewOptionsUseCase(reviewOptionsInfo) {
  const newReviewOptions = await makeReviewOptions(reviewOptionsInfo);
  return await reviewOptionsRepo.insert(newReviewOptions);
}

async function getReviewOptionssUseCase(reviewOptionsInfo) {
  return await reviewOptionsRepo.findAll();
}

async function getReviewOptionsByIdUseCase(reviewOptionsId) {
  return await reviewOptionsRepo.findById(reviewOptionsId);
}

async function updateReviewOptionsByIdUseCase(reviewOptionsId, reviewOptionsInfo) {
  return await reviewOptionsRepo.updateById(reviewOptionsId, reviewOptionsInfo);
}

export default { createReviewOptionsUseCase, getReviewOptionsByIdUseCase, getReviewOptionssUseCase, updateReviewOptionsByIdUseCase };
