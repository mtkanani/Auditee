const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

/**
 * Pagination is opt-in: a request without `page` gets every row (kanban boards
 * need the whole set), a request with `page` gets one page plus totals.
 */
const parsePagination = ({ page, limit } = {}) => {
  if (page === undefined || page === null || page === '') return null;
  const currentPage = Math.max(parseInt(page, 10) || 1, 1);
  const take = Math.min(Math.max(parseInt(limit, 10) || DEFAULT_LIMIT, 1), MAX_LIMIT);
  return { page: currentPage, limit: take, skip: (currentPage - 1) * take };
};

/** Runs findMany (and count when paging) for a Prisma model delegate. */
const findManyPaginated = async (model, args, paging) => {
  if (!paging) {
    return { data: await model.findMany(args), pagination: null };
  }

  const [totalRecords, data] = await Promise.all([
    model.count({ where: args.where }),
    model.findMany({ ...args, skip: paging.skip, take: paging.limit }),
  ]);

  return {
    data,
    pagination: {
      currentPage: paging.page,
      limit: paging.limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / paging.limit) || 1,
    },
  };
};

/** Turns a groupBy result into { [key]: count }. */
const countBy = (groups, key) =>
  Object.fromEntries(groups.map((g) => [g[key], g._count._all]));

module.exports = { parsePagination, findManyPaginated, countBy };
