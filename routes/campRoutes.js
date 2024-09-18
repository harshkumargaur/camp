const express = require('express');
const router = express.Router();
const multer = require('multer');

// console.log(__dirname.replace(/\\/g, '/'));
const { campStorage, campFileFilter } = require('./../utils/multerUtility');

const limits = {
  fileSize: 102400, /// 100 Kb
};

const upload = multer({
  storage: campStorage,
  fileFilter: campFileFilter,
  limits: limits,
});

const {
  pagination,
  postCamp,
  getCampById,
  updateCamp,
  deleteCamp,
  campFileUpload,
} = require('./../controllers/campControllers');

router.get('/page/:pageNo', async (req, res) => {
  const { pageNo } = req.params;
  await pagination(pageNo, res);
});

router.post('/', async (req, res) => {
  await postCamp(req, res);
});

router.post(
  '/profile/:campId',
  upload.single('avatar'),
  async (req, res, next) => {
    await campFileUpload(req, res, next);
  }
);

router.get('/:campId', async (req, res, next) => {
  await getCampById(req, res, next);
});

router.patch('/:campId', async (req, res) => {
  await updateCamp(req, res);
});

router.delete('/:campId', async (req, res) => {
  await deleteCamp(req, res);
});

module.exports = router;
