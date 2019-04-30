var express = require('express');
var router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

router.get('/:itemID', async (req, res) => {
    id = req.params.itemID;
    query = "SELECT id AS \"ID\", name AS \"Name\", descrip AS \"Description\", developer AS \"Developer\", platform AS \"Platform\", platformv AS \"Version\", price AS \"Price\" \
    FROM appTest WHERE id=\' " + id + "\'; "
    const result = await db.query(query);
    query2 = "SELECT itemID AS \"itemID\", date AS \"Date\", commentText AS \"commentText\", userName AS \"userName\" \
    FROM comments WHERE itemID=\' " + id + "\'; "
    const result2 = await db.query(query2);
    res.render('item', {rows: result.rows, commentInfo: result2.rows, user: req.session.user});
});


router.post('/:itemID', async (req, res) => {
  
    if (typeof(req.body.deleteComment) == "undefined"){
      const errors = [];

      if (!req.body.comment) {
        errors.push('Comment can not be empty');
      }
    
      if (!errors.length) {
        id = req.params.itemID;
        date = new Date().getTime();
        user = req.session.user.username;
  
        const queryAdd = '\
            INSERT INTO comments(itemID, date, commentText, userName) \
            VALUES (\'' + id + '\',\'' + date + '\',\'' + req.body.comment + '\',\'' + user + '\')';        
            console.log(queryAdd);
          await db.query(queryAdd);
        res.redirect('/items/' + id);
      } else {
        id = req.params.itemID;
        query = "SELECT id AS \"ID\", name AS \"Name\", descrip AS \"Description\", developer AS \"Developer\", platform AS \"Platform\", platformv AS \"Version\", price AS \"Price\" \
        FROM appTest WHERE id=\' " + id + "\'; "
        const result = await db.query(query);
        query2 = "SELECT itemID AS \"itemID\", date AS \"Date\", commentText AS \"commentText\", userName AS \"userName\" \
        FROM comments WHERE itemID=\' " + id + "\'; "
        const result2 = await db.query(query2);
        res.render('item', {rows: result.rows, commentInfo: result2.rows, user: req.session.user, errors: errors});
      }
    }else{
      const queryDel = 'DELETE FROM comments WHERE date=\'' + req.body.deleteComment + '\' and itemID=\'' + req.params.itemID + "\'; "
      console.log(queryDel);
      await db.query(queryDel);
      res.redirect('/items/' + req.params.itemID);
    }

  });
  


module.exports = router;
