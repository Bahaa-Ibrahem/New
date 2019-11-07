const createquestionsModel = require('../models/model');
const validationResult = require('express-validator').validationResult;

exports.getCreateQuestions = (req , res) => {
    if(validationResult(req).isEmpty()){
    res.render('createquestions', {
        isTeacher : req.session.teacherId,
        isStudent : req.session.isStudent,
        isAdmin   : req.session.isAdmin,
        isQuiz    : req.body.quizname,
        authError : req.flash('authError')[0] ,
        validationErrors : req.flash('validationErrors') ,
        pageTitle : 'Create questions'
    })
    }else{
    req.flash('validationErrors' , validationResult(req).array());
    res.redirect('/createquestions');
   }     
};

exports.getCreateQuestionsNew = (req , res) => {
    if(validationResult(req).isEmpty()){
    let name = req.params.name;
    res.render('createquestions', {
        isTeacher : req.session.teacherId,
        isStudent : req.session.isStudent,
        isAdmin   : req.session.isAdmin,
        isQuiz    : name,
        authError : req.flash('authError')[0] ,
        validationErrors : req.flash('validationErrors') ,
        pageTitle : 'Create questions'
    })
    }else{
    req.flash('validationErrors' , validationResult(req).array());
    res.redirect('/createquestions');
   }     
};

exports.postCreateQuestions = (req , res , next) => {
    if(validationResult(req).isEmpty()){
        createquestionsModel.addNewQuestion({
                question : req.body.question,
                posans1 : req.body.posans1,
                posans2 : req.body.posans2,
                posans3 : req.body.posans3,
                correctans : req.body.correctans,
                descreption : req.body.descreptions,
                teacherId : req.body.teacherId ,
                quizname    : req.body.quizname,
                timestamp : Date.now()
            }).then(() => {
                res.render('createquestions',  {
                    isTeacher : req.session.teacherId,
                    isQuiz    : req.body.quizname,
                    isStudent : req.session.isStudent,
                    isAdmin   : req.session.isAdmin,
                    authError : req.flash('authError')[0] ,
                    validationErrors : req.flash('validationErrors'),
                    pageTitle : 'Create questions' 
                });
            }).catch((err) => {
                next(err);
            })
    
    }else{
        req.flash('validationErrors' , validationResult(req).array());
        res.redirect('/createquestions');
    }
};