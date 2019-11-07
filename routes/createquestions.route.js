const router = require('express').Router();
const bodyParser = require('body-parser');
const check      = require('express-validator').check;
const authGuard  = require('./guards/auth.guard');
const createQuestionsController = require('../controllers/createquestions.controller');

router.get('/', authGuard.isAuthTeacher, createQuestionsController.getCreateQuestions);

router.get('/:name', authGuard.isAuthTeacher, createQuestionsController.getCreateQuestionsNew);

router.post('/' , authGuard.isAuthTeacher , 
                  bodyParser.urlencoded({extended : true}) , 
                  check('question').not().isEmpty().withMessage('question name required...') , 
                  check('posans1').not().isEmpty().withMessage('posans1 is required...') ,
                  check('posans2').not().isEmpty().withMessage('posans2 is required...') ,
                  check('posans3').not().isEmpty().withMessage('posans3 is required...') ,
                  check('correctans').not().isEmpty().withMessage('correctans is required...') ,
                  check('descreption').not().isEmpty().withMessage('descreption is required...') ,
                  createQuestionsController.postCreateQuestions
            );

module.exports = router;