const express = require('express');
const path = require('path');
const { upload } = require('../multer');
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require('../model/user'); 
const router = express.Router();
const fs = require('fs'); 
const jwt = require('jsonwebtoken'); 
const sendMail = require('../utils/sendMail'); 
const sendToken = require('../utils/jwtToken');
const { isAuthenticated } = require('../middleware/auth');


router.post("/create-user", async (req, res, next) => {
    try {
      const { firstName, lastName, email, password } = req.body;
      const userEmail = await User.findOne({ email });
  
      if (userEmail) {
        return next(new ErrorHandler("User already exists", 400));
      }
  
    //   const myCloud = await cloudinary.v2.uploader.upload(avatar, {
    //     folder: "avatars",
    //   });
  
      const user = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        // avatar: {
        //   public_id: myCloud.public_id,
        //   url: myCloud.secure_url,
        // },
      };
  
      const activationToken = createActivationToken(user);
  
      const activationUrl = `http://localhost:4200/activation/${activationToken}`;
  
      try {
        await sendMail({
          email: user.email,
          subject: "Activate your account",
          message: `Hello ${user.firstName}, please click on the link to activate your account: ${activationUrl}`,
        });
        res.status(201).json({
          success: true,
          message: `please check your email:- ${user.email} to activate your account!`,
        });
      } catch (error) {
        return next(new ErrorHandler(error, 500));
      }
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
});  

//creaate activation token
const createActivationToken = (user) => {
    return jwt.sign(user, process.env.ACTIVATION_SECRET, { expiresIn: '5m' });

};

//activate user
router.post("/activation", catchAsyncErrors(async(req,res,next) => {
    try {
        const { activation_token } = req.body;

        const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);

        if(!newUser){
            return next(new ErrorHandler("Invalid token or token has expired", 400));
        }

            const { firstName, lastName, email, password } = newUser;

            let user = await User.findOne({email});

            if(user){
                return next(new ErrorHandler("User already exists!", 400));
            }

            user = await User.create({
                firstName,
                lastName,
                email,
                password
            });
            
            sendToken(user, 201, res); 
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));

//login user
router.post("/login-user", catchAsyncErrors(async(req,res,next) => {
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return next(new ErrorHandler("eposta ve şifrenizi giriniz", 400));
        }

        const user =await User.findOne({email}).select("+password");

        if(!user){
            return next(new ErrorHandler("öyle biri yok", 401));
        }

        const isPasswordValid = await user.comparePassword(password);

        if(!isPasswordValid){
            return next(new ErrorHandler("şifreyi kontrol ediniz", 401));
        }

        sendToken(user, 201, res);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));

//load user
router.get("/getuser", isAuthenticated, catchAsyncErrors(async(req,res,next) => {
    try{
        const user = await User.findById(req.user.id);

        if (!user) {
            return next(new ErrorHandler("User not found!", 404));
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }
}));

//logout user
router.get("/logout", isAuthenticated, catchAsyncErrors(async(req,res,next) => {
    try {
        res.cookie("token", null, {
            expires:new Date(Date.now()),
            httpOnly: true
        });

        res.status(201).json({
            success: true,
            message: "logged out"
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}))

// update user info
router.put("/update-user-info", isAuthenticated, catchAsyncErrors(async(req,res,next) => {
    try {
        const {email,phoneNumber,firstName,lastName} = req.body;

        const user = await User.findOne({email}).select("+password");

        if(!user) {
            return next(new ErrorHandler("User not found!", 404));
        };

        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.phoneNumber = phoneNumber;

        await user.save();

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));

// update user avatar
router.put("/update-avatar", isAuthenticated, upload.single("image"), catchAsyncErrors(async(req,res,next) => {
    try {
        const existsUser = await User.findById(req.user.id);

        const existsAvatarPath = `uploads/${existsUser.avatar}`;

        fs.unlinkSync(existsAvatarPath);

        const fileUrl = path.join(req.file.filename);
        const user = await User.findByIdAndUpdate(req.user.id, {avatar: fileUrl});

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));

// update user addresses. isAuthenticated sildim postman için, geri ekleyeceğimdir
router.put("/update-user-addresses", catchAsyncErrors(async (req, res, next) => {
    try {
        console.log(req.body, "body")
        const user = await User.findById(req.body.userId);
        console.log(user, "user")

        const sameTypeAddress = user.addresses.find((addresses) => addresses.addressType === req.body.addressType);
        if (sameTypeAddress) {
            return next(new ErrorHandler(`${req.body.addressType} Bu adres zaten var`, 400));
        }

        const existsAddress = user.addresses.id(req.body._id); 
        if (existsAddress) {
            existsAddress.set(req.body);
        } else {
           
            user.addresses.push(req.body);
        }

        await user.save();

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));

// delete user address
router.delete("/delete-user-address/:id", isAuthenticated, catchAsyncErrors(async(req,res,next) => {
    try {
        const userId = req.user._id;
        const addressId = req.params.id;


        await User.updateOne({_id: userId}, {$pull: {addresses: {_id: addressId}}});

        const user = await User.findById(userId);

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));

// update user password
router.put("/update-user-password", isAuthenticated, catchAsyncErrors(async(req,res,next) => {
    try {
        const user = await User.findById(req.user.id).select("+password");

        const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

        if(!isPasswordMatched){
            return next(new ErrorHandler("Eski şifrenizi kontrol ediniz", 401));
        }

        if(req.body.newPassword !== req.body.confirmPassword){
            return next(new ErrorHandler("şifreler uyuşmuyor", 401));
        }
        user.password = req.body.newPassword;

        await user.save();

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));

//find user info with userid
router.get("/user-info/:id", catchAsyncErrors(async(req,res,next) => {
    try {
        const user = await User.findById(req.params.id);

        if(!user){
            return next(new ErrorHandler("User not found!", 404));
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));

module.exports = router; 