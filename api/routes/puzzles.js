var express = require('express');
var router = express.Router();
var puzzles = require('../services/puzzles');


router.options('/all',function(req,res,next) {
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
  next();
});
/* GET all puzzles */
router.get('/all', function (req, res, next) {
  console.log(res);
  try {
    res.json(puzzles.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error while getting puzzles `, err.message);
    next(err);
  }
});

router.options('/new',function(req,res,next){
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/* CREATE a new puzzle */
router.post('/new', function (req, res, next) {
  try {
    res.json(puzzles.create(req.body));
  } catch (err) {
    console.error(`Error while creating puzzles `, err.message);
    next(err);
  }
});

router.options('/',function(req,res,next){
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
  next();
})

/* FIND a puzzle based on UUID */
router.get('/get', function (req, res, next) {
  try {
    res.json(puzzles.findByUUID(req.query.uuid));
  } catch (err) {
    console.error(`Error while getting puzzle `, err.message);
    next(err);
  }
});

module.exports = router;
