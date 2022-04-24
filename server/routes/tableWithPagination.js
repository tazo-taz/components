const { Router } = require('express');
const { select } = require('../common tools/mysql');
const tableWithPagination = require('../functions/tableWithPagination');

const router = Router();

const parseData = (data) => {
  const newData = {};

  const { name, age, image, price } = data;

  if (name) newData.name = name;
  if (age) newData.age = age;
  if (image) newData.image = image;
  if (price) newData.price = price;

  return newData;
};

const ownFilters = ({ searchFilter, priceFromFilter, priceToFilter }) => {
  const filters = ['name', 'image'];
  const whereArr = [];
  const searchFilterArr = [];
  if (searchFilter)
    filters.forEach((a, b) => {
      searchFilterArr.push(
        (b === 0 ? '(' : '') + `${a} like '%${searchFilter}%'` + (b + 1 === filters.length ? ')' : ''),
      );
    });

  const searchFilterQuery = searchFilterArr.join(' or ');

  searchFilterQuery && whereArr.push(searchFilterQuery);
  priceFromFilter && whereArr.push(`price >= ${priceFromFilter}`);
  priceToFilter && whereArr.push(`price <= ${priceToFilter}`);

  return whereArr.join(' and ');
};

tableWithPagination(router, 'table', 'test', parseData, { ownFilters });

// 111111111111111111111111111111111111111111111111111111111111111111

const parseDataPost = (data) => {
  const newData = {};

  const { title, date } = data;

  if (title) newData.title = title;
  if (date) newData.date = date;

  return newData;
};

const controller = require('../controller/tableWithPagination');

tableWithPagination(router, 'post', 'posts', parseDataPost, {
  defaultFilters: ['title'],
  update: controller.update,
  insert: controller.insert,
  delete: controller.delete,
});

router.get('/postimage/:uid', async (req, res) => {
  const { uid } = req.params;
  const images = await select('post_images', { where: `postUid = ${uid}`, order: 'sort' });

  res.json({ data: images });
});

module.exports = router;
