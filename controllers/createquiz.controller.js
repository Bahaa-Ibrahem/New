const validationResult = require('express-validator').validationResult;
const createquizModel  = require('../models/model');

exports.getCreateQuiz = (req , res) => {
    if(validationResult(req).isEmpty()){
    res.render('createquiz' , {
        isTeacher : req.session.teacherId ,
        isStudent : req.session.isStudent,
        isAdmin   : req.session.isAdmin,
        authError : req.flash('authError')[0] ,
        validationErrors : req.flash('validationErrors'),
        pageTitle : 'Create quiz'
    })
    }else{
    req.flash('validationErrors' , validationResult(req).array());
    res.redirect('/createquiz');
   }     
};

exports.postCreateQuiz = (req , res , next) => {
    if(validationResult(req).isEmpty()){
        createquizModel.addNewQuiz({
                quizname  : req.body.quizname ,
                teacherId : req.body.teacherId ,
                timestamp : Date.now()
            }).then((quizname) => {
                res.render('createquestions', {
                    isTeacher : req.session.teacherId,
                    isQuiz    : quizname,
                    isAdmin   : req.session.isAdmin,
                    isStudent : req.session.isStudent,
                    authError : req.flash('authError')[0],
                    validationErrors : req.flash('validationErrors'),
                    pageTitle : 'Create questions' 
                });
            }).catch((err) => {
                next(err);
            })
    }else{
        req.flash('validationErrors' , validationResult(req).array());
        res.redirect('/createquiz');
    }
};

exports.postSaveQuiz = (req , res , next) => {
    let id = req.params.id;
    if(validationResult(req).isEmpty()){
        createquizModel.saveNewQuiz({
                _id       : id,
                quizname  : req.params.name ,
                teacherId : req.params.tid ,
                timestamp : req.params.time
            })
            .then(() =>{ 
               return createquizModel.deleteNewQuiz(id);
            }).then(() => {
                res.redirect('/viewteacherquiz');
            })
            .catch((err) => {
                res.redirect('/viewteacherquiz');
                next(err);
            })
    }else{
        req.flash('validationErrors' , validationResult(req).array());
        res.redirect('/createquiz');
    }
};


