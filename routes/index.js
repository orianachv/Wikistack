const express = require('express');
const router = express.Router();
 

router.use('/wiki', require('./wiki'));
router.use('/user', require('./user'));



module.exports = router;

