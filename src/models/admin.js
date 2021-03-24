const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const AdminSchema = new mongoose.Schema({
    email_address:{
        type:String,
        require:true
    },
    password:{
       type:String,
       required:true 
    },
    cpassword:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type: String,
            require:true
        }
    }]
})

// Here We Are Hashing the Password for Admin Portal
AdminSchema.pre('save', async function(next){
    try{
        if(this.isModified('password')){
            this.password = await bcrypt.hash(this.password, 12);
            this.cpassword = await bcrypt.hash(this.cpassword, 12);
        }
        next();
    }catch(e){
        res.status(402).send(e);
    }
})

//Here We are Creating JsonWebToken For Verifying Admin
AdminSchema.methods.generateAuthToken = async function(){
    try{
        let token = jwt.sign({_id:this._id}, process.env.SECRETKEY);
        //Now we Adding The Tokens in The DataBase And Here ConCat Means To add the Value In Field
        this.tokens = this.tokens.concat({token:token});
        this.save();
        return token
    }catch(e){
        res.status(422).send(e);
    }
}

const Admin = new mongoose.model("Admin", AdminSchema);

module.exports = Admin;