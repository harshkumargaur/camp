const express = require('express');
const router = express.Router();
const multer = require('multer');
const { checkSchema } = require('express-validator');
const {
  pageNoSchema,
  campBodySchema,
  mongoIdSchema,
  numDaysSchema,
} = require('./../utils/validatorSchema');

// console.log(__dirname.replace(/\\/g, '/'));
const { campStorage, campFileFilter } = require('./../utils/multerUtility');
const { userAuthMiddleware } = require('./../utils/authMiddlewareUtilitty');
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
  userBookCamp,
} = require('./../controllers/campControllers');

router.get(
  '/page/:pageNo',
  checkSchema(pageNoSchema, ['params']),
  async (req, res, next) => {
    const { pageNo } = req.params;
    await pagination(req, res, next, pageNo);
  }
);

router.post(
  '/',
  checkSchema(campBodySchema, ['body']),
  async (req, res, next) => {
    await postCamp(req, res, next);
  }
);

router.post(
  '/profile/:campId',
  upload.single('avatar'),
  async (req, res, next) => {
    await campFileUpload(req, res, next);
  }
);

router.get(
  '/:campId',
  checkSchema(mongoIdSchema, ['params']),
  async (req, res, next) => {
    await getCampById(req, res, next);
  }
);

router.patch(
  '/:campId',
  checkSchema(mongoIdSchema, ['params']),
  checkSchema(campBodySchema, ['body']),
  async (req, res, next) => {
    await updateCamp(req, res, next);
  }
);

router.delete(
  '/:campId',
  checkSchema(mongoIdSchema, ['params']),
  async (req, res, next) => {
    await deleteCamp(req, res, next);
  }
);

//////////////////////////// CAMP BOOKING ROUTES
router.post(
  '/:campId/book',
  userAuthMiddleware,
  checkSchema({ ...mongoIdSchema, ...numDaysSchema }, ['params', 'body']),
  async (req, res, next) => {
    await userBookCamp(req, res, next);
  }
);

module.exports = router;
