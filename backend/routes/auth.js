const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "Harryisgood"

//Route 1 : Create a user using : POST "/api/auth/createuser" and doesn't require authentication : no login required



router.post('/createuser',[
    body('name').isLength({min:3}),
    body('password').isLength({min:5}),
    body('email').isEmail()
] ,async (req,res)=>{
  let success = false;
// if there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(400).json({success,  errors : errors.array() });
  }
  // check user with same email User exists already

try {


  let user = await User.findOne({email: req.body.email});
  if(user){
    return res.status(400).json({success, error : "sorry a user with this email already exists"})
  }

  const salt = await bcrypt.genSalt(10);
  const secPass = await bcrypt.hash(req.body.password, salt);
  
user = await User.create({
    name : req.body.name,
    password : secPass,
    email : req.body.email,
});

const data = 
{
  user : {
    id : user.id
  }

}

const authtoken = jwt.sign(data, JWT_SECRET);
//console.log({authtoken})
success = true;
res.json({success, authtoken}) 

// res.json(user)
  
} catch (error) {
  console.error(error.message);
  res.status(500).send("Internal server Error");
}
 
})




//Route 2 : Authenticate user using : POST "/api/auth/login"  : no login required

router.post('/login',[
  body('password', 'password cannot be blank').exists(),
  body('email', 'Enter a valid email').isEmail()
] ,async (req,res)=>{
    let success = false;
  // if there are errors, return bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
  return res.status(400).json({ errors : errors.array() }); 
  }
 const {email, password} = req.body;

try {
  let user =await User.findOne({email});
  if(!user){
    return res.status(400).json({error : 'please try to login with correct credentials'});
  }
const passwordCompare =await  bcrypt.compare(password, user.password);
if(!passwordCompare){

  return res.status(400).json({success, error : 'please try to login with correct credentials'});
}
const data = 
{
  user : {
    id : user.id
  }
}
const authtoken = jwt.sign(data, JWT_SECRET);
success = true;
res.json({success, authtoken});
} catch (error) {
  console.error(error.message);
  res.status(500).send("Internal server Error");
}
})

//Route 3 : Get Loggedin  user detail using : POST "/api/auth/getuser"  : login required

router.post('/getuser',fetchuser, async (req,res)=>{

try {
 const userId = req.user.id;
  const user = await User.findById(userId).select("-password")
  res.send(user)
} catch (error) {
  console.error(error.message);
  res.status(500).send("Internal server Error");
}
})
module.exports = router