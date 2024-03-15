import countryModel from "../models/country.model.js";
import paginator from "../../helper/paginator.js";
import userModel from "../models/user.model.js";
import companyModel from "../models/company.model.js";
import institutionModel from "../models/institution.model.js";
import jobModel from "../models/job.model.js";
import studentModel from "../models/student.model.js";
import mentorModel from "../models/mentor.model.js";
import cityModel from "../models/city.model.js";
import provinceModel from "../models/province.model.js";

async function findAll(paginationQuery) {
  let query = {};
  const queryResult = await paginator(provinceModel, query, paginationQuery, [], { [paginationQuery?.name ? 'name' : 'order']: 1 });

  return queryResult;
}
async function findById(provinceId) {
  return await provinceModel.findById(provinceId).lean();
}
async function updateById(provinceId, updatedProvinceInfo) {
  return await provinceModel.findByIdAndUpdate(provinceId, updatedProvinceInfo, { new: true, runValidators: true }).lean();
}
async function insert(countryInfo) {
  const newCountry = new provinceModel(countryInfo);
  await newCountry.save();
  return newCountry;
}
async function removeProvinceById(provinceId) {
  //check if provinceId is used in user model
  let user = await userModel.findOne({ province: provinceId }).lean();
  if (user) {
    throw new Error("Province cannot be deleted it is used in user model");
  }

  //check if provinceId is used in company model headquarter.country
  let company = await companyModel.findOne({ "headQuarters.country": provinceId }).lean();
  if (company) {
    throw new Error("Province cannot be deleted it is used in company model");
  }

  //check if provinceId is used in institute model careerAdvisingLocation.country
  let institute = await institutionModel.findOne({ "careerAdvisingLocation.country": provinceId }).lean();
  if (institute) {
    throw new Error("Province cannot be deleted it is used in institute model");
  }

  //check if provinceId is used in job model country
  let job = await jobModel.findOne({ country: provinceId }).lean();
  if (job) {
    throw new Error("Province cannot be deleted it is used in job model");
  }

  //check if provinceId is used in student model volunteers array  country

  let student = await studentModel.findOne({ volunteers: { country: provinceId } }).lean();
  if (student) {
    throw new Error("Province cannot be deleted it is used in student model volunteers");
  }

  //check if provinceId is used in student model projetcs array  country

  student = await studentModel.findOne({ projects: { country: provinceId } }).lean();
  if (student) {
    throw new Error("Province cannot be deleted it is used in student model projects");
  }

  //check if provinceId is used in mentor model countries array
  let mentor = await mentorModel.findOne({ countries: provinceId }).lean();

  if (mentor) {
    throw new Error("Province cannot be deleted it is used in mentor model");
  }

  // //delete all cities in this country
  // const cities = await cityModel.find({ country: provinceId }).lean();
  // if (cities.length > 0) {
  //   cities.forEach(async (city) => {
  //     await cityModel.deleteOne({ _id: city._id });
  //   });
  // }
  //delete country
  await provinceModel.deleteOne({ _id: provinceId });
  return;
}

async function findByCountry(countryId, paginationQuery = false) {
 let query = { country_name: countryId };
  let query2 = { country_name: 'NA' };
  
  if (paginationQuery) {
    const queryResult = await paginator(cityModel, query, paginationQuery, []);
    return queryResult;
  }
  let order= {'name': 1  }
  let result = await provinceModel.find(query).sort(order).lean();
  if (result?.length === 0) {
    result = await provinceModel.find(query2).lean();
  }
  return result;

}

export default { findAll, insert, findById, updateById, removeProvinceById, findByCountry };
