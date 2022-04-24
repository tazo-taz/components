const { update, insert, deleteBy, deleteByUidArr } = require('../common tools/mysql');
const { _QUERY } = require('../db');

const getF = (table, filterFunc) => async (req, res) => {
  let { limit = 3, page = 0, order, orderType, searchFilter } = req.query;
  let where = 1;
  const returnData = {};

  const queryPars = ['select * from ' + table];

  if (filterFunc) {
    const tempWhere = filterFunc(req.query);
    if (tempWhere) where = tempWhere;
    queryPars.push(`where ${where}`);
  }

  queryPars.push(`order by ${order} ${orderType}`);

  if (limit) {
    queryPars.push(`limit ${limit} offset ${limit * page}`);
    const { count } = (await _QUERY(`select count(*) count from ` + table + ` where ${where}`))[0];
    returnData.count = count;
  }

  const query = queryPars.join(' ');
  returnData.items = await _QUERY(query);

  res.json({ data: returnData });
};

const updateF = (table, parseData) => async (req, res, next) => {
  const { uid } = req.params;
  await update(table, parseData(req.body), { where: `uid = ${uid}` });
  next();
};

const insertF = (table, parseData) => async (req, res, next) => {
  const { insertId } = await insert(table, parseData(req.body));
  next();
  return insertId;
};

const deleteF = (table) => async (req, res, next) => {
  await deleteByUidArr(table, req.body);
  next();
};

module.exports = (
  router,
  apiName,
  table,
  parseData,
  { defaultFilters, ownFilters, update, insert, delete: deleteCon } = {},
) => {
  let filterFunc;
  if (defaultFilters)
    filterFunc = ({ searchFilter }) => {
      const whereArr = [];
      defaultFilters.forEach((a) => {
        whereArr.push(`${a} like '%${searchFilter}%'`);
      });
      return whereArr.join(' or ');
    };
  else if (ownFilters) filterFunc = ownFilters;

  const get = getF(table, filterFunc);
  const upd = updateF(table, parseData);
  const ins = insertF(table, parseData);
  const del = deleteF(table);

  router.get(`/${apiName}`, get);

  router.post(`/${apiName}`, insert ? insert(ins) : ins, get);

  router.put(`/${apiName}/:uid`, update ? update(upd) : upd, get);

  router.delete(`/${apiName}`, deleteCon ? deleteCon(del) : del, get);
};
