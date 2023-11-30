require('dotenv').config()
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const registersSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: [true, "Email already exists!"],
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email")
            }
        }
    },
    gender:{
        type: String,
        required: true
    },
    phone: {
        type:  Number,
        required: true,
        unique: true,
        maxlength: 20,
    },
    age:{
        type: Number,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    cpassword:{
        type: String,
        required: true,
    },
    tokens:[{
        token:{
            type: String,
        required: true,
        }
    }]
})
// use middleware to generate authentication token using jwt
registersSchema.methods.genAuthToken = async function(){
    try {
        const token = jwt.sign({_id: this._id}, process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({token:token})
        await this.save()
        return this.tokens
    } catch (error) {
        console.log(error)
    }   
}
// use middleware to use hash password
registersSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10)
        this.cpassword = await bcrypt.hash(this.password,10)
    }
    
    next()

})

const registersModel = new mongoose.model("Register", registersSchema)

module.exports = registersModel