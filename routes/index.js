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

  let query = ' \
  SELECT id AS \"ID\", name AS \"Name\", descrip AS \"Description\", developer AS \"Developer\", platform AS \"Platform\", platformv AS \"Version\", price AS \"Price\" \
  FROM appTest';

  let x;
  if (req.query.filter === 'Description') {
    x = 'descrip';
  } else if (req.query.filter === 'Version') {
    x = 'platformv';
  } else {
    x = req.query.filter;
  }

  if (x) {
    query += ' ORDER BY ' + x;
    if (req.session.filter === 0) {
      query += ' DESC';
      req.session.filter += 1;
    } else {
      query += ' ASC';
      req.session.filter -= 1;
    }
  }

  const result = await db.query(query);

  res.render('index', { rows: result.rows, fields: result.fields, user: req.session.user, query });
});

router.post('/', async (req, res) => {
  let query = ' \
  SELECT id AS \"ID\", name AS \"Name\", descrip AS \"Description\", developer AS \"Developer\", platform AS \"Platform\", platformv AS \"Version\", price AS \"Price\" \
  FROM appTest';

  if (req.body.ID_filter) {
    query += " WHERE id = " + req.body.ID_filter;
  } else if (req.body.Name_filter) {
    query += " WHERE UPPER(name) LIKE UPPER(\'%" + req.body.Name_filter + "%\')";
  } else if (req.body.Description_filter) {
    query += " WHERE UPPER(descrip) LIKE UPPER(\'%" + req.body.Description_filter + "%\')";
  } else if (req.body.Developer_filter) {
    query += " WHERE UPPER(developer) LIKE UPPER(\'%" + req.body.Developer_filter + "%\')";
  } else if (req.body.Platform_filter) {
    query += " WHERE UPPER(platform) LIKE UPPER(\'%" + req.body.Platform_filter + "%\')";
  } else if (req.body.Version_filter) {
    query += " WHERE UPPER(platformv) LIKE UPPER(\'%" + req.body.Version_filter + "%\')";
  } else if (req.body.Price_filter) {
    query += " WHERE price = " + req.body.Price_filter;
  }

  if (req.body.search_bar) {
    query += " WHERE UPPER(CAST(id as text)) LIKE UPPER(\'%" + req.body.search_bar + "%\') OR UPPER(name) LIKE UPPER(\'%" + req.body.search_bar + "%\') \
    OR UPPER(descrip) LIKE UPPER(\'%" + req.body.search_bar + "%\') OR UPPER(developer) LIKE UPPER(\'%" + req.body.search_bar + "%\') \
    OR UPPER(platform) LIKE UPPER(\'%" + req.body.search_bar + "%\') OR UPPER(platformv) LIKE UPPER(\'%" + req.body.search_bar + "%\') \
    OR UPPER(CAST(price as text)) LIKE UPPER(\'%" + req.body.search_bar + "%\')";
  }

  const result = await db.query(query);
  res.render('index', { rows: result.rows, fields: result.fields, user: req.session.user, query });
});

router.get('/multer', (req, res) => {
  res.render('multer', {});
});
router.post('/photo', upload.single('photo'), (req, res) => {
  res.redirect('/');
});



module.exports = router;
