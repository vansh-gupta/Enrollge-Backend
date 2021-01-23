const express = require("express");
const app = express();
require("../src/db/connection");
const port = process.env.PORT || 5000;
const studentsrouter = require("./routers/studentsrouter");
const subjectsrouter = require("./routers/subjectsrouter");
const extracoursesrouter = require("./routers/extracoursesrouter");
const adminrouter = require("./routers/adminrouter");

app.use(express.json());
app.use(studentsrouter);
app.use(subjectsrouter);
app.use(extracoursesrouter);
app.use(adminrouter);

app.listen(port, () => {
    console.log(`Connection is Live at Port No. ${port}`);
})