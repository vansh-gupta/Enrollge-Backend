const express = require("express");
const app = express();
const dotenv = require("dotenv");
require("../src/db/connection");
const studentsrouter = require("./routers/studentsrouter");
const subjectsrouter = require("./routers/subjectsrouter");
const extracoursesrouter = require("./routers/extracoursesrouter");
const adminrouter = require("./routers/adminrouter");

dotenv.config({ path: './config.env' });

const PORT = process.env.PORT

app.use(express.json());
app.use(studentsrouter);
app.use(subjectsrouter);
app.use(extracoursesrouter);
app.use(adminrouter);

app.listen(PORT, () => {
    console.log(`Connection is Live at Port No. ${PORT}`);
})