const router = require('express').Router();
const bodyParser = require('body-parser');
const check      = require('express-validator').check;
const authGuard = require('./guards/auth.guard');
const createQuizController = require('../controllers/createquiz.controller');

router.get('/', authGuard.notAuthStudent , authGuard.isAuthTeacher, createQuizController.getCreateQuiz);

router.post('/' , authGuard.notAuthStudent, authGuard.isAuthTeacher , 
                  bodyParser.urlencoded({extended : true}) , 
                  check('quizname').not().isEmpty().withMessage('quizname is required...') ,
                  createQuizController.postCreateQuiz
            );

router.get('/:id/:name/:tid/:time' , authGuard.notAuthStudent, authGuard.isAuthTeacher , 
                  bodyParser.urlencoded({extended : true}) , 
                  createQuizController.postSaveQuiz
      );

module.exports = router;