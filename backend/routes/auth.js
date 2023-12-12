const express = require('express');
const User = require('../models/User');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");


const JWT_SECRET = process.env.JWT_SECRET_KEY


//Route 1: create a user using Post "/api/auth/createuser":no login requred

router.post("/createuser", [
    body('name', "Enter a valid name").isLength({ min: 3 }),
    body('email', "Enter a valid email").isEmail(),
    body('password', "Password must be atleast five characters").isLength({ min: 5 })


]
    , async (req, res) => {

        let success = false;

        //  If there are errors,return bad request and the errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() });
        }


        try {
            //  check whether the user with this email exits already

            let user = await User.findOne({ email: req.body.email })
            // console.log(user)
            if (user) {

                return res.status(400).json({ success, error: "please enter a unique value  for email" });
            }
            const salt = await bcrypt.genSalt(10);

            const secPass = await bcrypt.hash(req.body.password, salt)


            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPass
            })
            const data = {
                user: {
                    id: user.id
                }
            }
            // console.log("user>>>>>",data);

            const authToken = jwt.sign(data, JWT_SECRET);

            success = true;
            //   console.log(authToken);
            res.json({  success,authToken });


        }
        catch (error) {
            console.log({ error: error.message });
            res.status(500).send("internal server error")

        }


        //   .then(user => res.json(user))
        //   .catch(err=>{console.log(">>>>>>>>>>>>",err),
        // res.json({error:"please enter a unique value  for email",message:err.message})
        // })








        // console.log({email:req.body.email})
        // let user = await User.findOne({email:req.body.email})
        // // console.log(user)
        // if(user ){

        //     res.send({error:"please enter a unique value  for email"});
        // }
        // else{


        //     const errors = validationResult(req);
        //     // console.log(">>>>>>>>>>>>>>>>>>>",errors)
        //     // console.log(">>>>>>>>>>>>>>>>>>>",errors.errors)
        //     // console.log(">>>>>>>>>>>>>>>>>>>",errors.isEmpty())
        //     if (!errors.isEmpty()) {
        //         return res.status(400).json({ errors: errors.array() });
        //     }

        //     User.create({
        //         name: req.body.name,
        //         email: req.body.email,
        //         password: req.body.password
        //       }).then(user => res.json(user))
        //       .catch(err=>{console.log(err)
        //     res.json({error:"please enter a unique value  for email",message:err.message})
        //     })

        // }




        //    console.log(req.body);

        //    const user=User(req.body);
        //    user.save()
        // res.send(req.body);




    })



//Route 2: Authenticate a user using Post "/api/auth/login":no login requred

router.post("/login", [
    body('email', "Enter a valid email").isEmail(),
    body('password', "Password can not be blank").exists()


]
    , async (req, res) => {
        console.log(JWT_SECRET)
        let success = false;

        //  If there are errors,return bad request and the errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() });
        }

        const { email, password } = req.body;
        try {
            let user = await User.findOne({ email });

            if (!user) {

                return res.status(400).json({ success, error: "please try to login with correct credentials" });
            }

            const passwordCompare = await bcrypt.compare(password, user.password);

            // passwordCompare return true or false

            if (!passwordCompare) {

                return res.status(400).json({ success, error: "please try to login with correct credentials" });
            }
            const data = {
                user: {
                    id: user.id
                }
            }
            // console.log("user>>>>>",data);

            const authToken = jwt.sign(data, JWT_SECRET);
            success = true;
            //   console.log(authToken);
            res.json({ success, authToken });



        } catch (error) {
            console.log({ error: error.message });
            res.status(500).send("internal server error")

        }
    })


//Route 3: Get loggedin user Details using Post "/api/auth/getuser":Login required;


router.post("/getuser", fetchuser, async (req, res) => {


    try {
        userId = req.user.id
        const user = await User.findById(userId).select("-password");
        res.send(user)


    }

    catch (error) {
        console.log({ error: error.message });
        res.status(500).send("internal server error")

    }



})
module.exports = router;