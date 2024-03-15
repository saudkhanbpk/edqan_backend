import { domainRepo } from "../data-access-layer/index.js";
import { makeDomain } from "../entities/index.js";

async function createDomainUseCase(domainInfo) {
  const newDomain = await makeDomain(domainInfo);
  return await domainRepo.insert(newDomain);
}

async function getDomainsUseCase(domainInfo) {
  return await domainRepo.findAll();
}

async function getDomainByIdUseCase(domainId) {
  return await domainRepo.findById(domainId);
}

async function deleteDomainByIdUseCase(domainId) {
  return await domainRepo.deleteDomainById(domainId);
}

async function getDomainByNameUseCase(domainName) {
  return await domainRepo.findByName(domainName);
}

async function updateDomainByIdUseCase(domainId, domainInfo) {
  return await domainRepo.updateById(domainId, domainInfo);
}

export default {
  createDomainUseCase,
  getDomainsUseCase,
  getDomainByIdUseCase,
  updateDomainByIdUseCase,
  getDomainByNameUseCase,
  deleteDomainByIdUseCase,
};
