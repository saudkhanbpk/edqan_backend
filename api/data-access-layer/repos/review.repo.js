import reviewModel from "../models/review.model.js";
import paginator from "../../helper/paginator.js";

async function findAll(user, company, approved, paginationQuery) {
  let query = {};
  if (user) query.user = user;
  else if (company) query.company = company;

  if (approved) query.approved = approved;
  const queryResult = await paginator(reviewModel, query, paginationQuery, [
    {
      path: "user",
      populate: [{ path: "subModel" }],
    },
    {
      path: "user",
      populate: [{ path: "country" }],
    },
    {
      path: "user",
      populate: [{ path: "city" }],
    },
    {
      path: "user",
      populate: [{ path: "province" }],
    },
    "company",
    { path: "company", populate: [{ path: "country" }] },
    {
      path: "company",
      populate: [{ path: "subModel", populate: [{ path: "headQuarters", populate: [{ path: "city" }] }] }],
    },
    { path: "company", populate: [{ path: "subModel", populate: [{ path: "industries", populate: [{ path: "industry" }] }] }] },
    { path: "company", populate: [{ path: "subModel", populate: [{ path: "industries", populate: [{ path: "subIndustries" }] }] }] },
    {
      path: "company",
      populate: [{ path: "city" }],
    },

    //  {
    //     path: "company",
    //     populate: [{ path: "headQuarters",populate: [{ path: "city",populate: [{ path: "country" }] }] }],
    //   },
    // {
    //   path: "company",
    //   populate: [{ path: "subIndustry" }],
    // },
    "keyWays",
  ], { createdAt: -1 });

  return queryResult;
}
async function findById(reviewId) {
  return await reviewModel
    .findById(reviewId)
    .populate("keyWays")
    .populate("company")
    .populate({ path: "company", populate: [{ path: "country" }] })
    .populate({
      path: "company",
      populate: [{ path: "subModel", populate: [{ path: "headQuarters", populate: [{ path: "city" }] }] }],
    })
    .populate({ path: "company", populate: [{ path: "subModel", populate: [{ path: "industries", populate: [{ path: "industry" }] }] }] })
    .populate({ path: "company", populate: [{ path: "subModel", populate: [{ path: "industries", populate: [{ path: "subIndustries" }] }] }] })
    .populate({
      path: "company",
      populate: [{ path: "country" }],
    })

    .populate({
      path: "company",
      populate: [{ path: "city" }],
    })
    .populate("user")
    .populate({ path: "user", populate: [{ path: "subModel" }] })
    .populate({ path: "user", populate: [{ path: "country" }] })
    .populate({ path: "user", populate: [{ path: "country" }] })
    .populate({ path: "user", populate: [{ path: "city" }] }).
    lean();
}
async function updateById(reviewId, updatedReviewInfo) {
  return await reviewModel
    .findByIdAndUpdate(reviewId, updatedReviewInfo, {
      new: true,
      runValidators: true,
    })
    .lean();
}
async function insert(reviewInfo) {
  const newReview = new reviewModel(reviewInfo);
  await newReview.save();
  return newReview;
}
async function removeReviewById(ReviewId) {
  await reviewModel.deleteOne({ _id: ReviewId });
  return;
}
//make function find by id without populate
async function findByIdWithoutPopulate(reviewId) {
  return await reviewModel.findById(reviewId).lean();
}
export default { findAll, insert, findById, updateById, removeReviewById, findByIdWithoutPopulate };
