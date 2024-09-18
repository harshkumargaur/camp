const multer = require('multer');

const campStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `public/campImages/`);
  },
  filename: function (req, file, cb) {
    //// const str = '1726434996681-66e5c9854e03d8ef2274bf71.jpeg';
    //// console.log(str.split('.')[0].split('-')[1]);

    const { campId } = req.params;
    const uniqueSuffix =
      Date.now() + '-' + campId + '.' + file.mimetype.split('/')[1];
    // console.log(uniqueSuffix);

    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

const campFileFilter = function (req, file, cb) {
  if (file.mimetype.split('/')[0] !== 'image') {
    console.log('entered');

    return cb(new Error('file must be image'), false);
  }
  return cb(null, true);
};

module.exports = {
  campStorage,
  campFileFilter,
};
