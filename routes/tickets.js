const router = require('express').Router();
const verify = require('./verifyToken');

router.get("/", verify ,(req,res) =>{
    res.json({
        ticket : {
            title : 'ticket',
            data : 'ticket data'
        }
    });
});

module.exports = router;