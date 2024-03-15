import { reviewRepo, userRepo } from "../data-access-layer/index.js";
import { makeReview } from "../entities/index.js";
import { StudentCreatesReview, ReviewIsApprovedByAdminForStudent, ReviewIsApprovedByAdminForCompany } from "../notificationData/notificationData.js";

import notificationTypeEnum from "../types/notificationType.enum.js";
import userNotificationsUseCase from "./userNotifications.use-case.js";

async function createReviewUseCase(reviewInfo) {
  const student = await userRepo.findById(reviewInfo.user);
  const company = await userRepo.findById(reviewInfo.company);
  if (company.model != "Company") throw new Error("company not found");
  reviewInfo.user = reviewInfo.user;
  const newReview = await makeReview(reviewInfo);
  await reviewRepo.insert(newReview);
  // sends a notification when student creates a review
  await userNotificationsUseCase.createUserNotificationsUseCase(
    notificationTypeEnum.STUDENT_CREATES_REVIEW,
    reviewInfo.user,
    new StudentCreatesReview(student.subModel.firstName + " " + student.subModel.lastName, company.subModel.name)
  );
}

async function getReviewsUseCase(query, paginationQuery) {
  return await reviewRepo.findAll(query?.user, query?.company, query?.approved, paginationQuery);
}

async function getReviewByIdUseCase(reviewId) {
  return await reviewRepo.findById(reviewId);
}

async function updateReviewByIdUseCase(reviewId, reviewInfo) {
  const oldReview = await reviewRepo.findByIdWithoutPopulate(reviewId);
  const newReview = await makeReview({ ...oldReview, ...reviewInfo });
  await reviewRepo.updateById(reviewId, reviewInfo);
  // checks to see if the review approved state is updated
  if (oldReview?.approved != newReview?.approved) {
    // getting company name
    const companyName = await userRepo.findById(newReview.company).then((user) => user.subModel.name);
    // getting student name
    const studentName = await userRepo.findById(newReview.user).then((user) => user.subModel.firstName + " " + user.subModel.lastName);
    // sends notifications to the student when the review is approved by the admin
    await userNotificationsUseCase.createUserNotificationsUseCase(
      notificationTypeEnum.REVIEW_IS_APPROVED_BY_ADMIN_FOR_STUDENT,
      newReview.user,
      new ReviewIsApprovedByAdminForStudent(studentName, companyName, newReview.jobTitle)
    );
    // sends notifications to the company when the review is approved by the admin
    await userNotificationsUseCase.createUserNotificationsUseCase(
      notificationTypeEnum.REVIEW_IS_APPROVED_BY_ADMIN_FOR_COMPANY,
      newReview.company,
      new ReviewIsApprovedByAdminForCompany(companyName, "reviews page URL")
    );
  }
}

export default {
  createReviewUseCase,
  getReviewByIdUseCase,
  getReviewsUseCase,
  updateReviewByIdUseCase,
};
