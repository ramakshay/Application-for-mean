const router = require('express').Router();
const verify = require('./verifyToken');

router.get("/", verify ,(req,res) =>{
    res.json({
        test : {
            title : 'classified information',
            data : 'This is visible only to authenticated users'
        }
    });
});

module.exports = router;