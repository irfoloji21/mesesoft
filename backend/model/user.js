const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  firstName:{
    type: String,
    required: [true, "Please enter your name!"],
  },
  lastName:{
    type: String,
    required: [true, "Please enter your name!"],
  },
  email:{
    type: String,
    required: [true, "Please enter your email!"],
  },
  password:{
    type: String,
    required: [true, "Please enter your password"],
    minLength: [4, "Password should be greater than 4 characters"],
    select: false,
  },
  phoneNumber:{
    type: Number,
  },
  addresses:[
    {
      flatPlot: {
        type: Number,
      },
      address:{
        type: String,
      },
      zipCode:{
        type: String,
      },
      country:{
        type: String,
      },
      city:{
        type: String,
      },
      regionState:{
        type: String,
      },
      addressType:{
        type: String,
      }
    }
  ],
  role:{
    type: String,
    default: "user",
  },
  likedBlogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
  }],
//   avatar:{
//     public_id: {
//       type: String,
//       required: true,
//     },
//     url: {
//       type: String,
//       required: true,
//     },
//  },
coupons: [
  {
    couponID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CoupounCode', 
    },
    quantity: {
      type: Number,
      default: 0, 
    },
  },
],
 createdAt:{
  type: Date,
  default: Date.now(),
 },
 resetPasswordToken: String,
 resetPasswordTime: Date,
});


//  Hash password
userSchema.pre("save", async function (next){
  if(!this.isModified("password")){
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// jwt token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id}, process.env.JWT_SECRET_KEY,{
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
