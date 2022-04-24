const { _QUERY, DB } = require('../db');

module.exports.select = (table, { where = 1, order = 'uid' }) =>
  _QUERY(`select * from ${table} where ${where} order by ${order}`);

module.exports.update = (table, data, { where = 1 }) => {
  const paramKeys = Object.keys(data)
    .map((a, b, c) => {
      return a + ' = ?' + (c.length == b + 1 ? '' : ',');
    })
    .join(' ');

  const paramValues = Object.values(data);

  return new Promise((resolve, reject) => {
    DB().query(`UPDATE ${table} SET ${paramKeys} WHERE ${where}`, paramValues, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

module.exports.insert = (table, data) => {
  const sql = `INSERT INTO ${table} SET ?`;
  return new Promise((res, rej) => {
    DB().query(sql, data, (err, result) => {
      if (err) rej(err);
      else res(result);
    });
  });
};

module.exports.deleteBy = (table, where) => _QUERY(`delete from ${table} where ${where}`);

module.exports.deleteByUid = (table, uid) => this.deleteBy(table, `uid = ${uid}`);

module.exports.deleteByUidArr = (table, uids) => this.deleteBy(table, `uid in (${uids.join(',')})`);
