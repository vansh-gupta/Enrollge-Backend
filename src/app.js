const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/config.env` });
const cors = require("cors");
const express = require("express");
const app = express();
require("../src/db/connection");
const studentsrouter = require("./routers/studentsrouter");
const subjectsrouter = require("./routers/subjectsrouter");
const extracoursesrouter = require("./routers/extracoursesrouter");
const adminrouter = require("./routers/adminrouter");
const cookieparser = require("cookie-parser");


app.use(cors());
app.use(cookieparser());


const PORT = process.env.PORT

app.use(express.json());
app.use(studentsrouter);
app.use(subjectsrouter);
app.use(extracoursesrouter);
app.use(adminrouter);

app.listen(PORT, () => {
    console.log(`Connection is Live at Port No. ${PORT}`);
})