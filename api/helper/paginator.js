export default async function paginator(model, modelQuery, paginationQuery, populateFields, sort, select) {
  if (typeof modelQuery !== "object" || Object.keys(modelQuery).length == 0) {
    modelQuery = {};
  }
  const [queryResult, wholeModelDataCount] = await Promise.all([
    model
      .find(modelQuery)
      .limit(paginationQuery?.pageSize)
      .sort(sort)
      .select(select)
      .skip(paginationQuery?.page * paginationQuery?.pageSize)
      .populate(populateFields)
      .lean(),
    model.count(modelQuery),
  ]);
  let pagesLeft = Math.ceil(wholeModelDataCount / +paginationQuery?.pageSize - (+paginationQuery?.page + 1));
  if (pagesLeft < 0) pagesLeft = 0;
  // const pageCount = paginationQuery?.pageSize * paginationQuery?.page;
  const nextPage = pagesLeft > 0;
  const hasPrevious = paginationQuery?.page > 0;
  return {
    queryResult,
    wholeModelDataCount,
    queryDataLength: queryResult.length,
    pagesLeft,
    nextPage,
    hasPrevious,
  };
}
