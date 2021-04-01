const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/config.env` });
const cors = require("cors");
const express = require("express");
const app = express();
const path = require("path");
require("../src/db/connection");
const studentsrouter = require("./routers/studentsrouter");
const subjectsrouter = require("./routers/subjectsrouter");
const coursesrouter = require("./routers/coursesrouter");
const adminrouter = require("./routers/adminrouter");
const cookieparser = require("cookie-parser");


app.use(cors());
app.use(cookieparser());


const PORT = process.env.PORT

app.use(express.json());
app.use(studentsrouter);
app.use(subjectsrouter);
app.use(coursesrouter);
app.use(adminrouter);

app.use(express.static(path.join(__dirname, 'build')));

// Add Frontend Work From React Js
app.get("/", async (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.listen(PORT, () => {
    console.log(`Connection is Live at Port No. ${PORT}`);
})