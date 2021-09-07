const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/config.env` });
const cors = require("cors");
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
require("../src/db/connection");
const cookieparser = require("cookie-parser");
const fileUpload = require('express-fileupload');
const helmet = require("helmet");
const authServer = require('./middleware/authServer');
// For Admin Panel
const adminUniversityNews = require('./routers/adminRouters/universityNews');
const adminChapterNotesAndQuestionBank = require('./routers/adminRouters/chapterNotesAndQuestionBank');
const adminAuth = require('./routers/adminRouters/adminAuth');
const adminSubjects = require('./routers/adminRouters/subjects');
const adminCourses = require('./routers/adminRouters/courses');
const adminReports = require('./routers/adminRouters/reports');
const adminCoursesTypes = require('./routers/adminRouters/courseTypes');
const adminFeedback = require('./routers/adminRouters/feedback');
const adminSettings = require('./routers/adminRouters/settings');
const adminUniversity = require('./routers/adminRouters/university');
const adminDashboard = require('./routers/adminRouters/dashboard');
const adminPreviousYearPaper = require('./routers/adminRouters/subjectpreviousyearpapers');
// For Mobile API
const appCourses = require('./routers/appRouters/courses');
const appUniversity = require('./routers/appRouters/university');
const appSubjects = require('./routers/appRouters/subjects');
const appStudentsAuth = require('./routers/appRouters/studentsAuth');
// For Website API
const webContactUs = require('./routers/webRouters/contactUs');

const PORT = process.env.PORT

let corsOptions = {
    origin: ['https://enrollge.tk', 'https://enrollge.ml', 'https://enrollge.tech', 'https://enrollge.ga'],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// Middelwares
app.use(cors(corsOptions));
app.use(cookieparser());
app.use(express.json());
app.use(fileUpload());
app.use(helmet());
app.use(authServer);

// For Using High Limit in Uploading Images And PDF From Admin Panel
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));


// For Admin Panel
app.use(adminUniversityNews);
app.use(adminChapterNotesAndQuestionBank);
app.use(adminAuth);
app.use(adminSubjects);
app.use(adminCourses);
app.use(adminReports);
app.use(adminCoursesTypes);
app.use(adminFeedback);
app.use(adminSettings);
app.use(adminUniversity);
app.use(adminDashboard);
app.use(adminPreviousYearPaper);

// For Mobile APP
app.use(appCourses);
app.use(appUniversity);
app.use(appSubjects);
app.use(appStudentsAuth);

// For Website
app.use(webContactUs);

app.listen(PORT, () => {
    console.log(`Connection is Live at Port No. ${PORT}`);
})