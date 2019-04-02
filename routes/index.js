var express = require('express');
var router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const multer = require('multer');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'public/images/');
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });


router.get('/', async (req, res) => {
  if (!req.session.filter) {
    req.session.filter = 0;
  }

  const query = ' \
  SELECT * \
  FROM appTest';

  // if (x) {
  //   query += ' ORDER BY ' + x;
  //   if (req.session.filter === 0) {
  //     query += ' DESC';
  //     req.session.filter += 1;
  //   } else {
  //     query += ' ASC';
  //     req.session.filter -= 1;
  //   }
  // }

  const result = await db.query(query);

  res.render('index', { rows: result.rows, fields: result.fields, query });
});

router.get('/multer', (req, res) => {
  res.render('multer', {});
});
router.post('/photo', upload.single('photo'), (req, res) => {
  res.redirect('/');
});



module.exports = router;
