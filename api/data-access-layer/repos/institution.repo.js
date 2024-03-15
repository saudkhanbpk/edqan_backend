import institutionModel from "../models/institution.model.js";
import paginator from "../../helper/paginator.js";
import { application } from "express";
import applicationRepo from "./application.repo.js";

async function findByIdWithoutPopulate(institutionId) {
  return await institutionModel.findById(institutionId).lean();
}

async function findAll(paginationQuery) {
  let query = {};
  const queryResult = await paginator(institutionModel, query, paginationQuery, [
    {
      path: "careerAdvisingLocation",
      populate: [
        {
          path: "country",
        },
        {
          path: "city",
        },
        {
          path: "province"
        }
      ],
    },
  ]);
  return queryResult;
}
async function findById(institutionId) {
  return await institutionModel
    .findById(institutionId)
    .populate({
      path: "careerAdvisingLocation",
      populate: [
        {
          path: "country",
        },
        {
          path: "city",
        },
        {
          path: "province",
        },
      ],
    })
    .populate("user")
    .lean();
}
async function updateById(institutionId, updatedInstitutionInfo) {
  return await institutionModel
    .findByIdAndUpdate(institutionId, updatedInstitutionInfo, {
      new: true,
      runValidators: true,
    })
    .populate({
      path: "careerAdvisingLocation",
      populate: [
        {
          path: "country",
        },
        {
          path: "city",
        },
        {
          path: "province",
        },
      ],
    })
    .lean();
}
async function insert(institutionInfo) {
  const newInstitution = new institutionModel(institutionInfo);
  await newInstitution.save();
  return newInstitution;
}
async function removeInstitutionById(InstitutionId) {
  await institutionModel.deleteOne({ _id: InstitutionId });
  return;
}



export default { findAll, insert, findById, updateById, removeInstitutionById, findByIdWithoutPopulate };
