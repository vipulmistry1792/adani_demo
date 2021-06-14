const express = require('express');
const router = express.Router();
const tags = require('../services/tags');

/* GET quotes listing. */
router.get('/', async function(req, res, next) {
  try {
    res.json(await tags.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error while getting Tags `, err.message);
    next(err);
  }
});
/* GET quotes listing. */
router.get('/serial', async function(req, res, next) {
  try {
    res.json(await tags.getRTUTags(req.query.page));
  } catch (err) {
    console.error(`Error while getting Tags `, err.message);
    next(err);
  }
});
/* POST quotes */
router.post('/', async function(req, res, next) {
  //console.log(JSON.stringify(req.body));
  try {
    //res.json(req.body);
    res.json(await tags.create(req.body));
  } catch (err) {
    console.error(`Error while posting tags `, err.message);
    next(err);
  }
});
/* POST quotes */
router.post('/column', async function(req, res, next) {
  //console.log(req.body);
  try {
    //res.json(req.body);
    res.json(await tags.datafiled(req.body));
  } catch (err) {
    console.error(`Error while posting tags `, err.message);
    next(err);
  }
});
module.exports = router;
