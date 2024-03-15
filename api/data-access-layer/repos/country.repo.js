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
  const queryResult = await paginator(countryModel, query, paginationQuery, [], { [paginationQuery?.id ? 'name' : 'order']: 1 })

  return queryResult;
}
async function findById(countryId) {
  return await countryModel.findById(countryId).lean();
}
async function updateById(countryId, updatedCountryInfo) {
  return await countryModel.findByIdAndUpdate(countryId, updatedCountryInfo, { new: true, runValidators: true }).lean();
}
async function insert(countryInfo) {
  const newCountry = new countryModel(countryInfo);
  await newCountry.save();
  return newCountry;
}
async function removeCountryById(CountryId) {
  //check if countryId is used in user model
  let countryInfo = await countryModel.findById({ _id: CountryId }).lean();
  // return console.log("countryInfo :",countryInfo)
  let user = await userModel.findOne({ country: CountryId }).lean();
  if (user) {
    throw new Error("Country cannot be deleted it is used in user model");
  }

  //check if countryId is used in company model headquarter.country
  let company = await companyModel.findOne({ "headQuarters.country": CountryId }).lean();
  if (company) {
    throw new Error("Country cannot be deleted it is used in company model");
  }

  //check if countryId is used in institute model careerAdvisingLocation.country
  let institute = await institutionModel.findOne({ "careerAdvisingLocation.country": CountryId }).lean();
  if (institute) {
    throw new Error("Country cannot be deleted it is used in institute model");
  }

  //check if countryId is used in job model country
  let job = await jobModel.findOne({ country: CountryId }).lean();
  if (job) {
    throw new Error("Country cannot be deleted it is used in job model");
  }

  //check if countryId is used in student model volunteers array  country

  let student = await studentModel.findOne({ volunteers: { country: CountryId } }).lean();
  if (student) {
    throw new Error("Country cannot be deleted it is used in student model volunteers");
  }

  //check if countryId is used in student model projetcs array  country

  student = await studentModel.findOne({ projects: { country: CountryId } }).lean();
  if (student) {
    throw new Error("Country cannot be deleted it is used in student model projects");
  }

  //check if countryId is used in mentor model countries array
  let mentor = await mentorModel.findOne({ countries: CountryId }).lean();

  if (mentor) {
    throw new Error("Country cannot be deleted it is used in mentor model");
  }

  // //delete all province in this country
  // const province = await provinceModel.find({ country_name: countryInfo.name }).lean();
  // if (province.length > 0) {
  //   province.forEach(async (provinceItem) => {
  //     await provinceModel.deleteOne({ country_name: provinceItem.name });
  //   });
  // }
  // //delete all cities in this country
  // const cities = await cityModel.find({ country_name: countryInfo.name }).lean();
  // if (cities.length > 0) {
  //   cities.forEach(async (city) => {
  //     await cityModel.deleteOne({ country_name: city.country_name });
  //   });
  // }
  //delete country
  await countryModel.deleteOne({ _id: CountryId });
  return;
}

export default { findAll, insert, findById, updateById, removeCountryById };
