const express          = require('express');
const app              = express();
const path             = require('path');
const session          = require('express-session');
const SessionStore     = require('connect-mongodb-session')(session);
const flash            = require('connect-flash');
const homeRouter       = require('./routes/home.route');
const authRouter       = require('./routes/auth.route');
const createQuizRouter = require('./routes/createquiz.route');
const createQuestionsRouter = require('./routes/createquestions.route');
const quizesRouter     = require('./routes/quizes.route');

app.use(express.static(path.join(__dirname , 'assets'))); //To make static folder 
app.use(express.static(path.join(__dirname , 'images'))); //To make static folder 

app.use(flash());

const STORE = new SessionStore({
    uri : 'mongodb+srv://Bahaa:112314516@cluster0-60txf.mongodb.net/quiz?retryWrites=true&w=majority',
    collection : 'sessions'
});

app.use(session({
    secret : 'this is my secret to hash express session....',
    saveUninitialized : false,
    resave : true,
    store : STORE
}));

app.set('view engine' , 'ejs'); //To create template engine ejs
app.set('views' , 'views'); //Default name views

app.use('/', homeRouter);
app.use('/', authRouter);
app.use('/createquiz', createQuizRouter);
app.use('/createquestions', createQuestionsRouter);
app.use('/quizes', quizesRouter);

app.use((req, res, next) => {
    res.status(404);
    res.render('not-found', {
        isStudent : req.session.isStudent,
        isTeacher : req.session.teacherId,
        isAdmin   : req.session.isAdmin,
        pageTitle : 'Page not found'
    });
});

app.use((req, res, next) => {
    res.status(500);
    res.render('error', {
        isStudent  : req.session.studentId,
        isTeacher : req.session.teacherId,
        isAdmin : req.session.isAdmin,
        pageTitle : 'Page error'
    })
});

const PORT = process.env.PORT || 3000;

app.listen(PORT , () => {
    console.log('Node.js server is running on port ' + PORT);
});