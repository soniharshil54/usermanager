const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const multer = require("multer")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const checkAuth = require("../../middlewares/checkAuth")



const User = require("../../models/user")

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './profileUploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});


router.get("/dashboard",checkAuth,(req,res,next) => 
    User.find()
    .sort({ date: -1 })
    .then(users => res.header("Access-Control-Allow-Origin", "*").json(users))
)



router.post("/signup",upload.single('profileImage'),(req,res,next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if(user.length>=1){
                return res.status(500).header("Access-Control-Allow-Origin", "*").json({message:"mail already exists"})
            }

            else {
                bcrypt.hash(req.body.password,10,(err,hash) => {
                    if(err){
                        return res.status(500).json({error:err})
                    }
                    else {
                        var profile = req.file?req.file.path:"profileUploads/noprofile.png"
                        const newUser = new User(
                            {
                                _id: new mongoose.Types.ObjectId(),
                                name: req.body.name,
                                email: req.body.email,
                                dob: req.body.dob,
                                contact: req.body.contact,
                                address: req.body.address,
                                country:req.body.country,
                                state: req.body.state,
                                city:req.body.city,
                                profile: profile,
                                password:hash
                            }
                        )
                    
                        newUser.save()
                                .then((result => {
                                    console.log(result)
                                    res.status(201).header("Access-Control-Allow-Origin", "*").json({message:"user created"})
                                }))
                                .catch(err => {
                                    console.log(err)
                                    res.status(500).header("Access-Control-Allow-Origin", "*").json({error:err})
                                })
                    }
                })
            }
        })

    
})

router.post("/login",(req,res,next)=> {
    User.find({email:req.body.email})
        .exec()
        .then(user => {
            console.log(user)
            if(user.length < 1){
                return res.status(401).header("Access-Control-Allow-Origin", "*").json({message:"user with this mail doesnt exist"})
            }

            bcrypt.compare(req.body.password, user[0].password, (err,result) => {
                if(err){
                    return res.status(401).header("Access-Control-Allow-Origin", "*").json({message:"wrong password"})
                }
                if(result){
                    const token = jwt.sign(

                        {
                            email: user[0].email,
                            name: user[0].name,
                            userId: user[0]._id
                        },
                        "soni3360",
                        {
                            expiresIn: '1h'
                        })

                        return res.status(200).header("Access-Control-Allow-Origin", "*").json({message: "auth successfull", token:token, user: user})

                }

                res.status(402).header("Access-Control-Allow-Origin", "*").json({message: "wrong password"})
            })



        })
        .catch(err => {
            console.log(err)
            res.status(500).header("Access-Control-Allow-Origin", "*").json({
                error: err
            })
        })


})



router.delete("/delete/:userId",checkAuth,(req,res)=>{
    User.remove({_id:req.params.userId})
        .exec()
        .then(result => {
            console.log(result)
            res.status(200).header("Access-Control-Allow-Origin", "*").json({
                message:"user deleted"
            })
        }) 
        .catch(err => {
            console.log(err)
            res.status(500).header("Access-Control-Allow-Origin", "*").json({
                error:err
            })

        })    
       
})


router.patch("/edit", (req, res, next) => {
  const mailid = req.body.email;
  console.log(req.body)
  let newObj = {};
    Object.keys(req.body).forEach(function(prop) {
        newObj[prop] = req.body[prop];
    });
  console.log(newObj)
  User.updateOne({ email: mailid }, { $set: newObj})
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'User updated',
          user: result
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});








module.exports = router

