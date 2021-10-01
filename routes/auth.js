const router = require('express').Router();
const User = require('../model/user');
const { registerValidation , loginValidation} = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// Register
router.post('/register', async (req,res) => {
    //Validation
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Check existing user
    const emailExist = await User.findOne({email : req.body.email});
    if(emailExist) return res.status(400).send("Email already exists");

    //Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password,salt);

    //Creating a new user
    const user = new User({
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        email : req.body.email,
        password : hashPassword,
        address : req.body.address,
        phone : req.body.phone,
        role : req.body.role
    });
    try {
        const savedUser = await user.save();
        res.send({user : user._id});
    }
    catch(err) {
        res.status(400).send(err);
    }
});

//Login
router.post("/login", async (req,res) => {
    //Validation
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Check for user
    const user = await User.findOne({email : req.body.email});
    if(!user) return res.status(400).send("Email not found");

    //Password validation
    const validPassword = await bcrypt.compare(req.body.password , user.password);
    if(!validPassword) return res.status(400).send("Invalid Password");

    //Create token
    const accessToken = jwt.sign({_id : user._id,firstName: user.firstName}, process.env.SECRET_TOKEN1,{expiresIn:'20s'});
    const refreshToken = jwt.sign({_id : user._id,firstName: user.firstName}, process.env.SECRET_TOKEN2,{expiresIn:'2h'})
    res.header('access-token','Bearer '+accessToken).json({accessToken,refreshToken});

});

//refresh-token
router.post('/refresh-token', async (req,res,next) => {
    const refreshToken = req.body.token;
    //check for refresh token
    if(!refreshToken){
        res.status(403).json({msg: "user not authenticated"});
    }
    //compare token with secret key
    
    jwt.verify(refreshToken,process.env.SECRET_TOKEN2,(err,data) => {
        if(!err) {
            //generating access token
            const accessToken = jwt.sign({_id : data._id,firstName: data.firstName}, process.env.SECRET_TOKEN1,
                {expiresIn:'20s'});
            res.status(201).json({ accessToken });
        }
        else {
            res.status(403).json({msg: "Invalid refresh token"});
        }

    })

});

//logout 
router.delete("/logout",async (req,res,next) => {

});

module.exports = router;