import {
  companyRepo,
  jobRepo,
  profileViewsRepo,
  studentRepo,
  applicationRepo,
} from "../data-access-layer/index.js";
import companyModel from "../data-access-layer/models/company.model.js";
import { makeCompany } from "../entities/index.js";

import fs from "fs/promises";
import path from "path";
const __dirname = path.resolve();

async function createCompanyUseCase(companyInfo) {
  if (companyInfo.headQuarters)
    companyInfo.headQuarters = JSON.parse(companyInfo.headQuarters);
  if (companyInfo.addresses)
    companyInfo.addresses = JSON.parse(companyInfo.addresses);
  if (companyInfo.industries)
    companyInfo.industries = JSON.parse(companyInfo.industries);
if(companyInfo.agreeToTerms)
{
  companyInfo.agreeToTerms = JSON.parse(companyInfo?.agreeToTerms);
}
  const newCompany = await makeCompany({
    ...companyInfo,
    _id: companyInfo.subModel,
  });

  return await companyRepo.insert(newCompany);
}

async function getCompanysUseCase(companyInfo, query) {
  return await companyRepo.findAll(
    companyInfo?.school,
    companyInfo?.country,
    companyInfo?.workType,
    query
  );
}

async function getStudentFromCompanysUseCase(companyId, query) {
  return await companyRepo.getStudentsThatHireFromCompany(companyId, query);
}

async function getCompanyByIdUseCase(companyId) {
  return await companyRepo.findById(companyId);
}

async function updateCompanyByIdUseCase(companyId, companyInfo) {
  if (companyInfo.headQuarters && typeof companyInfo.headQuarters === "string")
    companyInfo.headQuarters = JSON.parse(companyInfo.headQuarters);
  if (companyInfo.addresses && typeof companyInfo.addresses === "string")
    companyInfo.addresses = JSON.parse(companyInfo.addresses);
  if (companyInfo.industries && typeof companyInfo.industries === "string")
    companyInfo.industries = JSON.parse(companyInfo.industries);
  if (
    companyInfo.toBeDeletedImages &&
    typeof companyInfo.toBeDeletedImages === "string"
  )
    companyInfo.toBeDeletedImages = JSON.parse(companyInfo.toBeDeletedImages);
  if (
    companyInfo.jobApplicationMessages &&
    typeof companyInfo.jobApplicationMessages === "string"
  )
    companyInfo.jobApplicationMessages = JSON.parse(
      companyInfo.jobApplicationMessages
    );
  if (companyInfo.guideLines)
    companyInfo.guideLines = JSON.parse(companyInfo.guideLines);
  if (companyInfo.receiveMessage)
    companyInfo.receiveMessage = JSON.parse(companyInfo.receiveMessage);

  let oldCompany = await companyRepo.findByIdWithoutPopulate(companyId);
  //delete old images
  if (companyInfo.toBeDeletedImages) {
    const promises = companyInfo.toBeDeletedImages.map(async (imageIndex) => {
      // Gets the path of the image by using the index of the image to be deleted to get its URL from old company data
      let toBeDeletedCompanyMediaPath = oldCompany.companyMedia[imageIndex];

      // Splitting the company media path to get the path of the image
      toBeDeletedCompanyMediaPath = toBeDeletedCompanyMediaPath.split(
        process.env.SERVER_URL
      )[1];

      // Check if the image exists in the fs or not, and avoid errors if it doesn't exist
      try {
        await fs.promises.readdir(toBeDeletedCompanyMediaPath);
        // Deleting the image from the fs
        await fs.promises.unlink(__dirname + "/" + toBeDeletedCompanyMediaPath);
      } catch (error) {
        // Handle error, if needed
      }

      return imageIndex; // Return the image index to be used later in the filtering step
    });

    // Wait for all the fs operations to complete before continuing
    const deletedImageIndexes = await Promise.all(promises);

    // Remove the deleted image indexes from the company media array using filter
    oldCompany.companyMedia = oldCompany.companyMedia.filter(
      (_, index) => !deletedImageIndexes.includes(index)
    );

    // Removing the toBeDeletedImages property from the companyInfo object
    delete companyInfo.toBeDeletedImages;
  }

  //pushing new images to old images
  if (companyInfo.companyMedia) {
    // if (!Array.isArray(companyInfo.companyMedia)) oldCompany.companyMedia.push(companyInfo.companyMedia);
    if (
      !Array.isArray(companyInfo.companyMedia) &&
      companyInfo.companyMedia.length > 0
    ) {
      if (oldCompany.companyMedia.length > 0) {
        //add new images to old images
        oldCompany.companyMedia.push(companyInfo.companyMedia);
      } else {
        oldCompany.companyMedia = [...companyInfo.companyMedia];
      }
    }
    if (Array.isArray(companyInfo.companyMedia)) {
      if (oldCompany.companyMedia?.length > 0) {
        oldCompany.companyMedia.push(...companyInfo.companyMedia);
      } else {
        oldCompany.companyMedia = companyInfo.companyMedia;
      }
    }
  }

  oldCompany = { ...oldCompany, ...companyInfo, _id: companyId };
  const updateCompany = makeCompany(oldCompany);

  return await companyRepo.updateById(companyId, updateCompany);
}

async function getNumberOfDistinctUsersWhoAppliedToJobsInTimeRange(query) {
  return await applicationRepo.getNumberOfDistinctUsersWhoAppliedToJobsInTimeRange(
    new Date(query.startDate),
    new Date(query.endDate)
  );
}

async function getNumberOfDistinctUsersWhereStatusIsHiredInTimeRange(
  companyId,
  query
) {
  return await applicationRepo.getNumberOfDistinctUsersWhereStatusIsHiredInTimeRange(
    companyId,
    new Date(query.startDate),
    new Date(query.endDate)
  );
}

async function getNumberOfStudentsWhoFollowedCompany(companyId) {
  return await studentRepo.getNumberOfStudentsWhoFollowedCompany(companyId);
}

async function findAllUsersWhoViewedAProfile(userId, query) {
  return await profileViewsRepo.findAllUsersWhoViewedAProfile(
    userId,
    query.startDate,
    query.endDate
  );
}

async function getStudentsByApplicationStatusAndSort(companyId, query) {
  return await applicationRepo.getUserCountByCompanyAndFilters(
    companyId,
    query.workType,
    query.jobType,
    query.startDate,
    query.endDate
  );
}

async function getNumberOfDistinctUsersByCompanyWhereStatusIsHiredInTimeRange(
  companyId,
  query
) {
  return await applicationRepo.getNumberOfDistinctUsersByCompanyWhereStatusIsHiredInTimeRange(
    companyId,
    query.startDate,
    query.endDate
  );
}

async function getNumberOfJobViews(companyId, jobId) {
  return await jobRepo.findNumberOfViews(companyId, jobId);
}

async function getApplicationsByCompanyUseCase(companyId, paginationQuery) {
  return await applicationRepo.getApplicationsByCompany(
    companyId,
    paginationQuery
  );
}

async function getApplicationsByCompanyAndStatusUseCase(
  companyId,
  paginationQuery
) {
  return await applicationRepo.getApplicationsByCompanyAndStatus(
    companyId,
    paginationQuery
  );
}

async function getCompaniesThatHiresRemotesUseCase(paginationQuery) {
  return await applicationRepo.getCompaniesThatHiresRemote(paginationQuery);
}

export default {
  createCompanyUseCase,
  getCompanysUseCase,
  getCompanyByIdUseCase,
  updateCompanyByIdUseCase,
  getStudentFromCompanysUseCase,
  getNumberOfDistinctUsersWhoAppliedToJobsInTimeRange,
  getNumberOfDistinctUsersWhereStatusIsHiredInTimeRange,
  getNumberOfStudentsWhoFollowedCompany,
  findAllUsersWhoViewedAProfile,
  getStudentsByApplicationStatusAndSort,
  getNumberOfDistinctUsersByCompanyWhereStatusIsHiredInTimeRange,
  getNumberOfJobViews,
  getApplicationsByCompanyUseCase,
  getApplicationsByCompanyAndStatusUseCase,
  getCompaniesThatHiresRemotesUseCase,
};
