var express = require('express');
var router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');


/* GET users listing. */
router.get('/:itemID', async (req, res) => {
    id = req.params.itemID;
    query = "SELECT id AS \"ID\", name AS \"Name\", descrip AS \"Description\", developer AS \"Developer\", platform AS \"Platform\", platformv AS \"Version\", price AS \"Price\" \
    FROM appTest WHERE id=\' " + id + "\'; "
    const result = await db.query(query);
    res.render('item', {rows: result.rows});
});


module.exports = router;
