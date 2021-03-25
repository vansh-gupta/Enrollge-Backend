const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const StudentsSchema = mongoose.Schema({
    Full_Name: {
        type: String,
        require: true,
        trim: true
    },
    Course: {
        type: String,
        require: true,
        trim: true
    },
    Branch: {
        type: String,
        require: true,
        trim: true
    },
    Semester: {
        type: Number,
        require: true,
    },
    Gmail_Id: {
        type: String,
        require: true
    },
    Mobile_No: {
        type: String,
        require: true,
        unique: true
    },
    College_Name: {
        type: String,
        require: true,
        trim: true
    },
    Password: {
        type: String,
        require: true
    },
    CPassword: {
        type: String,
        require: true
    },
    Tokens: [{
        Token: {
            type: String,
            require: true
        }
    }]
});

// Here We Add Pre Method For Hashing The Password
StudentsSchema.pre('save', async function (next) {
    if (this.isModified('Password')) {
        this.Password = await bcrypt.hash(this.Password, 12);
        this.CPassword = await bcrypt.hash(this.CPassword, 12);
    }
    next();
})

// Here We are generating JsonWebToken
StudentsSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRETKEY);
        // Here ConCat Means To Add Filed Value
        this.Tokens = this.Tokens.concat({ Token: token });
        await this.save();
        return token;
    } catch (error) {
        res.status(422).send(error);
    }
}


// Here, We Are Creating An Collection in MongoDB Database
const Students = new mongoose.model("Students", StudentsSchema);

module.exports = Students;