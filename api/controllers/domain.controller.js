import { domainUseCase } from "../use-cases/index.js";
import { successfullyCreatedResponse, successfulResponse } from "../helper/response-formatter.js";

async function createDomain(httpRequest) {
  const newDomain = await domainUseCase.createDomainUseCase(httpRequest.body);
  return successfullyCreatedResponse(newDomain);
}
async function getDomains(httpRequest) {
  return httpRequest.query.name
    ? successfulResponse(await domainUseCase.getDomainByNameUseCase(httpRequest.query.name))
    : successfulResponse(await domainUseCase.getDomainsUseCase());
}
async function getDomainById(httpRequest) {
  return successfulResponse(await domainUseCase.getDomainByIdUseCase(httpRequest.params._id));
}
async function deleteDomainById(httpRequest) {
  return successfulResponse(await domainUseCase.deleteDomainByIdUseCase(httpRequest.params._id));
}
async function updateDomainById(httpRequest) {
  return successfulResponse(await domainUseCase.updateDomainByIdUseCase(httpRequest.params._id, httpRequest.body));
}

export default { createDomain, getDomainById, getDomains, updateDomainById, deleteDomainById };
