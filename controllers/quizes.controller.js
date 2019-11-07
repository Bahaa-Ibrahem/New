const createquizModel  = require('../models/model');
const validationResult = require('express-validator').validationResult;

exports.getQuizes = (req , res ,next) => {
    if(validationResult(req).isEmpty()){
        createquizModel.getQuizes().then((quizes) => {
            res.render('quizes' , {
                quizes    : quizes,
                isAdmin   : req.session.isAdmin,
                isStudent : req.session.isStudent,
                isTeacher : req.session.teacherId,
                authError : req.flash('authError')[0],
                validationErrors : req.flash('validationErrors'),
                pageTitle : 'Quizes'
            });
        }).catch((err) => {
            next(err);
        })
    }else{
        req.flash('validationErrors' , validationResult(req).array());
        res.redirect('/quizes');
    }     
};

exports.viewQuiz = (req , res ,next) => {
    let quizname = req.params.name;
    if(validationResult(req).isEmpty()){
        createquizModel.viewQuiz(quizname).then((questions) => {
            res.render('viewquiz' , {
                questions : questions,
                isStudent : req.session.isStudent ,
                isTeacher : req.session.teacherId,
                isAdmin   : req.session.isAdmin,
                authError : req.flash('authError')[0],
                validationErrors : req.flash('validationErrors'),
                pageTitle : 'View quiz'
            });
        }).catch((err) => {
            next(err);
        })
    }else{
        req.flash('validationErrors' , validationResult(req).array());
        res.redirect('/quizes');
    }     
};