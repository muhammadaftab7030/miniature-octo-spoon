require('dotenv').config()
const express = require('express');
require('./db/dbconn');
const path = require('path');
const hbs = require('hbs');
const app = express()
const bcrypt = require('bcrypt');
const staticPath = path.join(__dirname,'../public')
const templatePath = path.join(__dirname,'../templates/views')
const partialPath = path.join(__dirname, '../templates/partials')
const port = process.env.PORT || 3000
const registersModel = require('./models/registers');

// parses the JSON data and adds it into req body
app.use(express.json())
//
app.use(express.urlencoded({extended: false}))

// for css link in index.hbs
app.use("/public",express.static(staticPath))
// to set the views as a template engine
app.set('view engine', 'hbs')
// set default views directory to custom directory
app.set("views",templatePath)
// set partials, register partials
hbs.registerPartials(partialPath)
app.get('/',async (req,res)=>{
    const usersData = await registersModel.find()
    res.render("login")
})
app.get('/register',(req,res)=>{
    res.render("register")
})
app.post("/login", async(req,res)=>{
    try {
        
        const {email,password} = req.body
        const filteredRecord = await registersModel.findOne({email:email})
        const isMatch = await bcrypt.compare(password,filteredRecord.password)
        const token = await filteredRecord.genAuthToken();
        if(isMatch){
            res.status(201).render("index")
        }else{
            res.send("Invalid Login")
        }
        
    } catch (error) {
        res.status(400).send(error)
    }
})
app.post('/register',async(req,res)=>{
    try {
        const { firstname, lastname, email, gender, phone,age,cpassword, password} = req.body 
        if(password !== cpassword){
            res.send("Password does not match!")
        }else{
            const result = new registersModel({
                firstname: firstname,
                lastname: lastname,
                email: email,
                gender: gender,
                phone: phone, 
                age: age,
                password: password,
                cpassword: cpassword
            }) 
            const token = await result.genAuthToken()
            const addData = await result.save()
            res.status(201).render("login")
        }
            
    } catch (error) {
        res.status(400).send(error)
    }
})
app.get("*",(req,res)=>{
    res.status(404).send("Oops! Page not found")
})
// listening to port
app.listen(port, ()=>{
    console.log(`I am listening to port ${port}`)
})