import { successfulResponse } from "../helper/response-formatter.js";
import { searchUseCase } from "../use-cases/index.js";

async function search(httpRequest) {
  if (!httpRequest.query.model) {
    throw new Error("Model is required");
  }
  if (!httpRequest.query.term) {
    throw new Error("Term is required");
  }
  const { model, term } = httpRequest.query;
  const result = await searchUseCase.search(model, term, httpRequest.paginationQuery);

  return successfulResponse(result);
}
export default { search };
