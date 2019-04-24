var express = require('express');
var router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/login', (req, res) => {
  res.render('login', { title: 'Express' });
});

router.get('/register', (req, res) => {
  res.render('register', { title: 'Express' });
});

router.post('/register', async (req, res) => {
  const errors = [];

  if (req.body.password !== req.body.passwordConf) {
    errors.push('The provided passwords do not match.');
  }

  if (!(req.body.email && req.body.username && req.body.password && req.body.passwordConf)) {
    errors.push('All fields are required.');
  }

  const selectQuery = 'SELECT * FROM appUsers WHERE username = $1';
  const selectResult = await db.query(selectQuery, [req.body.username]);

  if (selectResult.rows.length > 0) {
    errors.push('That username is already taken.');
  }

  if (!errors.length) {
    const insertQuery = 'INSERT INTO appUsers (username, email, password) VALUES ($1, $2, $3)';
    const password = await bcrypt.hash(req.body.password, 10);

    await db.query(insertQuery, [req.body.username, req.body.email, password]);

    res.redirect('login');
  } else {
    res.render('register', { errors });
  }
});

router.post('/login', async (req, res) => {
  const errors = [];

  const selectQuery = 'SELECT * FROM appUsers WHERE username = $1';
  const selectResult = await db.query(selectQuery, [req.body.username]);

  if (selectResult.rows.length === 1) {
    const auth = await bcrypt.compare(req.body.password, selectResult.rows[0].password);

    if (auth) {
      [req.session.user] = selectResult.rows;
      res.redirect('/');
    } else {
      errors.push('Incorrect username/password');
      res.render('login', { errors });
    }
  } else {
    errors.push('Incorrect username/password');
    res.render('login', { errors });
  }
});

router.get('/change-password', (req, res) => {
  res.render('change-password');
});

router.post('/change-password', async (req, res) => {
  const errors = [];
  const selectQuery = 'SELECT * FROM appUsers WHERE username = $1';
  const selectResult = await db.query(selectQuery, [req.session.user.username]);

  const auth = await bcrypt.compare(req.body.old_password, selectResult.rows[0].password);
  const auth2 = (req.body.new_password === req.body.new_password_conf);

  if (auth) {
    if (req.body.new_password) {
      if (auth2) {
        const password = await bcrypt.hash(req.body.new_password, 10);
        const changeQuery = 'UPDATE appUsers SET password = $1 WHERE username = $2';

        await db.query(changeQuery, [password, req.session.user.username]);

        const assignQuery = 'SELECT * FROM appUsers WHERE username = $1';
        const assignResult = await db.query(assignQuery, [req.session.username]);
        req.session.user = assignResult.rows;
        res.redirect('/');
      } else {
        errors.push('New passwords do not match');
        res.render('change-password', { errors });
      }
    } else {
      errors.push('Nothing entered for new password');
      res.render('change-password', { errors });
    }
  } else {
    errors.push('Old Password is not correct');
    res.render('change-password', { errors });
  }
});

router.get('/add', (req, res) => {
  res.render('add');
});

router.post('/add', async (req, res) => {
  const errors = [];

  if (!req.body.name || !req.body.descrip || !req.body.developer || !req.body.platform || !req.body.version || !req.body.price) {
    errors.push('All fields must be filled out');
  }

  if (!errors.length) {
    const queryAdd = '\
       INSERT INTO appTestPending(name, descrip, developer, platform, platformv, price, username) \
       VALUES (\'' + req.body.name + '\',\'' + req.body.descrip + '\',\'' + req.body.developer + '\',\'' + req.body.platform + '\',\'' + req.body.version + '\',' + req.body.price + ',\'' + req.session.user.username + '\')';
    console.log(queryAdd);
    await db.query(queryAdd);
    res.redirect('/');
  } else {
    res.render('add', { errors });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

router.get('/pending', async (req, res) => {
  if (!req.session.filter) {
    req.session.filter = 0;
  }

  let query = ' \
  SELECT id AS \"ID\", name AS \"Name\", descrip AS \"Description\", developer AS \"Developer\", platform AS \"Platform\", platformv AS \"Version\", price AS \"Price\", username AS \"Submitter\" \
  FROM appTestPending';

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
  console.log(query);
  const result = await db.query(query);
  res.render('pending', { rows: result.rows, fields: result.fields, user: req.session.user });
});

router.post('/pending/approve', async (req, res) => {
  const query = 'SELECT * FROM apptestpending \
  WHERE apptestpending.name = \'' + req.body.approve + '\'';
  const result = await db.query(query);

  const queryMessage = 'INSERT INTO submessage(id, name, descrip, username, admin) \
  VALUES (' + result.rows[0].id + ',\'' + result.rows[0].name + '\', \'' + result.rows[0].descrip + '\', \'' + result.rows[0].username + '\', \'' + req.session.user.username + '\')';
  await db.query(queryMessage);

  const query1 = 'INSERT INTO apptest(name, descrip, developer, platform, platformv, price) \
  VALUES (\'' + result.rows[0].name + '\',\'' + result.rows[0].descrip + '\', \'' + result.rows[0].developer + '\',\'' + result.rows[0].platform + '\',\'' + result.rows[0].platformv + '\',' + result.rows[0].price + ');';
  const query2 = 'DELETE FROM apptestpending \
  WHERE apptestpending.name = \'' + result.rows[0].name + '\'';
  await db.query(query1);
  await db.query(query2);

  res.redirect('/users/subMessages/?id=' + result.rows[0].id);

});

router.post('/pending/deny', async (req, res) => {
  const query = 'SELECT * FROM apptestpending \
  WHERE apptestpending.name = \'' + req.body.deny + '\'';
  const result = await db.query(query);

  const queryMessage = 'INSERT INTO submessage(id, name, descrip, username, admin) \
  VALUES (' + result.rows[0].id + ',\'' + result.rows[0].name + '\', \'' + result.rows[0].descrip + '\', \'' + result.rows[0].username + '\', \'' + req.session.user.username + '\')';
  await db.query(queryMessage);

  const query2 = 'DELETE FROM apptestpending \
  WHERE apptestpending.name = \'' + result.rows[0].name + '\'';
  await db.query(query2);

  res.redirect('/users/subMessages/?id=' + result.rows[0].id);
});

router.get('/subMessages', async (req, res) => {
  res.render('submissionMessage');
});

router.post('/subMessages', async (req, res) => {
  const query = 'UPDATE submessage \
  SET message = \'' + req.body.reasoning + '\', A_D = \'' + req.body.result + '\' \
  WHERE submessage.id = \'' + req.query.id + '\'';
  await db.query(query);
  res.redirect('/users/pending');
});

module.exports = router;
