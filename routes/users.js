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

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
