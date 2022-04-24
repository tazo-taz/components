const multer = require('multer');
const { insert, update, select, deleteByUid } = require('../common tools/mysql');
const { deleteFile, ifExistsDelete } = require('../common tools/file');

const reactFolder = '../client/public/images/';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, reactFolder);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + file.originalname);
  },
});
const upload = multer({ storage: storage });

module.exports.insert = (respone) => async (req, res, next) =>
  upload.array('images')(req, res, async function (err) {
    if (err instanceof multer.MulterError) console.log('muler error', err);
    else if (err) console.log(err);
    else {
      const insertId = await respone(req, res, next);
      req.files.forEach((a, b) => {
        insert('post_images', { postUid: insertId, imageUrl: a.filename, sort: b + 1 });
      });
    }
  });

module.exports.update = (respone) => (req, res, next) =>
  upload.array('images')(req, res, async function (err) {
    if (err instanceof multer.MulterError) console.log('muler error', err);
    else if (err) console.log(err);
    else {
      req.body.imagesSorted = req.body.imagesSorted.split(',');
      if (req.body.deletedImages) {
        if (Array.isArray(req.body.deletedImages)) req.body.deletedImages.forEach((a) => deleteByUid('post_images', a));
        else deleteByUid('post_images', req.body.deletedImages);
      }
      req.files.forEach((a, b) => {
        insert('post_images', {
          postUid: req.params.uid,
          imageUrl: a.filename,
          sort: req.body.imagesSorted.findIndex((b) => b === a.originalname) + 1,
        });
      });
      req.body.imagesSorted.forEach((a, b) => {
        if (req.files.find((b) => b.filename === a)) return;
        update('post_images', { sort: b + 1 }, { where: `imageUrl = '${a}'` });
      });
      respone(req, res, next);
    }
  });

module.exports.delete = (respone) => async (req, res, next) => {
  for (let a of req.body) {
    const images = await select('post_images', { where: `postUid = ${a}` });
    images.forEach((b) => ifExistsDelete(reactFolder + b.imageUrl));
  }
  respone(req, res, next);
};
