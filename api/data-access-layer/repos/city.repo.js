import cityModel from "../models/city.model.js";
import paginator from "../../helper/paginator.js";
import userModel from "../models/user.model.js";
import jobModel from "../models/job.model.js";
import studentModel from "../models/student.model.js";
import companyModel from "../models/company.model.js";
import institutionModel from "../models/institution.model.js";

async function findAll(paginationQuery) {
  let query = {};
  const queryResult = await paginator(cityModel, query, paginationQuery, [], {[paginationQuery?.name ? 'name' : 'order']: 1  });

  return queryResult;
}
async function findById(cityId) {
  return await cityModel.findById(cityId).lean();
}
async function findByCountry(countryId, paginationQuery=false) {
   let query = { state_name: countryId };
  let query2 = { state_name: 'NA' };
  
  if (paginationQuery) {
    const queryResult = await paginator(cityModel, query, paginationQuery, []);
    return queryResult;
  }
  let order= {'name': 1  }
  let result = await cityModel.find(query).sort(order).lean();
  if (result?.length === 0) {
    result = await cityModel.find(query2).lean();
  }
  return result;

}
async function updateById(cityId, updatedCityInfo) {
  return await cityModel
    .findByIdAndUpdate(cityId, updatedCityInfo, {
      new: true,
      runValidators: true,
    })
    .lean();
}
async function insert(cityInfo) {
  const newCity = new cityModel(cityInfo);
  await newCity.save();
  return newCity;
}
async function removeCityById(CityId) {

 
  //check if city is used in user model
  let user = await userModel.findOne({ city: CityId });
  if (user) {
    throw new Error("City is used in user");
  }
  //check if city is used in job model
  let job = await jobModel.findOne({ city: CityId });
  if (job) {
    throw new Error("City is used in job");
  }
  // //check if city is used in student model volunteers array  city
  // let student = await studentModel.findOne({ volunteers: CityId });
  // if (student) {
  //   throw new Error("City is used in student volunteers");
  // }
  //check if city is used in student careerInterests array  city
  // student = await studentModel.findOne({ careerInterest: CityId });
  // if (student) {
  //   throw new Error("City is used in student careerInterest");
  // }

  //check if city is used in student model projects array  city
  // student = await studentModel.findOne({ projects: CityId });
  // if (student) {
  //   throw new Error("City is used in student projects");
  // }

  // check if city is used in company model  headQuarters city
  let company = await companyModel.findOne({ "headQuarters.city": CityId });
  if (company) {
    throw new Error("City is used in company headQuarters");
  }

  //check if city is used in institution model careerAdvisingLocation.city
  let institution = await institutionModel.findOne({ "careerAdvisingLocation.city": CityId });
  if (institution) {
    throw new Error("City is used in institution careerAdvisingLocation");
  }

  await cityModel.deleteOne({ _id: CityId });
  return;
}

export default { findAll, insert, findById, updateById, removeCityById, findByCountry };
