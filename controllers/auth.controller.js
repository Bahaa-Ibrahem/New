const authModel        = require('../models/model');
const validationResult = require('express-validator').validationResult;

/*-----------------------------Admin Controller-------------------------------------------*/

exports.getQuizes = (req , res ,next) => {
    if(validationResult(req).isEmpty()){  
        authModel.getQuizes().then((quizes) => {
            res.render('mangmentquiz' , {
                quizes    : quizes,
                isStudent : req.session.isStudent,
                isTeacher : req.session.teacherId,
                isAdmin   : true,
                authError : req.flash('authError')[0],
                validationErrors : req.flash('validationErrors'),
                pageTitle : 'Quiz Mangment'
            });
        }).catch((err) => {
            next(err);
        })
    }else{
        req.flash('validationErrors' , validationResult(req).array());
        res.redirect('/quizes');
    }     
};

exports.posQuizes = (req , res) => {
    let id = req.params.id;
    authModel.deleteQuiz(id)
    .then(() => {
        res.redirect('/admin/mangmentquiz');
    })
    .catch((err) => {
        next(err);
    })
};

/*---------------------------------Teacher Mangment------------------------------------*/

exports.getTeachers = (req , res ,next) => {
    if(validationResult(req).isEmpty()){  
        authModel.getTeachers().then((teachers) => {
            res.render('mangmentteacher' , {
                teachers  : teachers,
                isStudent : req.session.isStudent,
                isTeacher : req.session.teacherId,
                isAdmin   : true,
                authError : req.flash('authError')[0],
                validationErrors : req.flash('validationErrors'),
                pageTitle : 'User Mangment'
            });
        }).catch((err) => {
            next(err);
        })
    }else{
        req.flash('validationErrors' , validationResult(req).array());
        res.redirect('/admin/mangmentstudent');
    }     
};

exports.posTeachers = (req , res) => {
    let id = req.params.id;
    let isAdmin = req.params.isAdmin;
    if(isAdmin == 'true'){
        res.redirect('/admin/mangmentteacher');
    }else{
        authModel.deleteTeacher(id)
            .then(() => {
                res.redirect('/admin/mangmentteacher');
            })
            .catch((err) => {
                next(err);
            })
    }
};

/*-----------------------------Teacher Controller-------------------------------------------*/

exports.viewTeacherQuizes = (req, res) => {
    if(validationResult(req).isEmpty()){ 
        let id = req.session.teacherId;
        authModel.getTeacherQuizes(id).then((teacherquizes) => {
            res.render('viewteacherquiz' , {
                teacherquizes : teacherquizes ,
                isStudent : req.session.isStudent,
                isTeacher : true,
                isAdmin   : req.session.isAdmin,
                authError : req.flash('authError')[0],
                validationErrors : req.flash('validationErrors'),
                pageTitle : 'Publish Quizes'
            });
        }).catch((err) => {
            next(err);
        })
    }else{
        req.flash('validationErrors' , validationResult(req).array());
        res.redirect('/createquiz');
    } 
};

exports.viewQuizQuestions = (req, res) => {
    if(validationResult(req).isEmpty()){ 
        let quizname = req.params.name;
        authModel.viewQuiz(quizname).then((questions) => {
            res.render('viewquizquestions' , {
                questions  : questions,
                isStudent : req.session.isStudent,
                isTeacher : true,
                isAdmin   : req.session.isAdmin,
                authError : req.flash('authError')[0],
                validationErrors : req.flash('validationErrors'),
                pageTitle : 'Quiz questions'
            });
        }).catch((err) => {
            next(err);
        })
    }else{
        req.flash('validationErrors' , validationResult(req).array());
        res.redirect('/viewteacherquiz');
    } 
};

exports.deleteQuestion = (req , res) => {
    let id = req.params.id;
    let name = req.params.name;
        authModel.deleteQuestion(id)
            .then(() => {
                res.redirect('/viewquizquestions/'+name);
            })
            .catch((err) => {
                next(err);
            })
};

exports.getSignup = (req , res) => {
        res.render('signup' , {
            authError : req.flash('authError')[0] ,
            validationErrors : req.flash('validationErrors') ,
            isTeacher : req.session.teacherId,
            isAdmin   : req.session.isAdmin,
            isStudent : req.session.isStudent,
            pageTitle : 'Signup'
    });
};

exports.postSignup = (req , res) => {
    if(validationResult(req).isEmpty()){
        authModel.createNew(req.body.username, req.body.email, req.body.password, req.body.isStudent).then((
            res.redirect('/login')
        )).catch((err) => {
            console.log('Eroor bad : ' + err);
            res.redirect('/signup'); 
        });
    }else{
        req.flash('validationErrors' , validationResult(req).array());
        res.redirect('/signup');
    }  
};

exports.getLogin = (req , res) => {
    res.render('login' , {
        authError : req.flash('authError')[0] ,
        validationErrors : req.flash('validationErrors') ,
        isTeacher : req.session.teacherId,
        isAdmin   : req.session.isAdmin,
        isStudent : req.session.isStudent,
        pageTitle : 'Login'
    });
};

exports.postLogin = (req , res, next) => {
    if(validationResult(req).isEmpty()){
        authModel.login(req.body.email , req.body.password).then((result) => {
            req.session.teacherId = result.id;
            req.session.isAdmin = result.isAdmin;
            req.session.isStudent = result.isStudent;
            res.redirect('/');
            }).catch((err) => {
            req.flash('authError' , err);
            console.log(err);
            res.redirect('/login');
        });
    }else{
        req.flash('validationErrors' , validationResult(req).array());
        res.redirect('/login');
    }
};

exports.logout = (req ,res) => {
    req.session.destroy(function(err){
        if(err){
           console.log(err);
        }else{
            res.redirect('/login');
        }
     });
};
