const router     = require('express').Router();
const bodyParser = require('body-parser');
const check      = require('express-validator').check;
const authController = require('../controllers/auth.controller');
const authGuard      = require('./guards/auth.guard');
const adminGuard      = require('./guards/admin.guard');

/*-----------------------------Admin Router-------------------------------------------*/

router.get('/admin/mangmentquiz', adminGuard, authController.getQuizes);

router.get('/admin/mangmentquiz/:id', adminGuard, authController.posQuizes);

router.get('/admin/mangmentteacher', adminGuard, authController.getTeachers);

router.get('/admin/mangmentteacher/:id/:isAdmin', adminGuard, authController.posTeachers);

/*-----------------------------Teacher Router-------------------------------------------*/

router.get('/signup' , authGuard.notAuthTeacher , authController.getSignup);

router.post('/signup' , authGuard.notAuthTeacher , bodyParser.urlencoded({extended : true}) , 
            check('username').not().isEmpty().withMessage('user name required...') , 
            check('email').not().isEmpty().withMessage('email required...').isEmail().withMessage('it is not format email...') ,
            check('password').not().isEmpty().withMessage('pssword required...').isLength({min : 6}).withMessage('your password must be more than 6 charchters...') , 
            check('confirmpassword').custom((value , {req}) => {
                if(value === req.body.password) return true;
                else throw 'password not matches...';
            }).withMessage('password not matches...') ,
            authController.postSignup);

router.get('/login' , authGuard.notAuthTeacher, authController.getLogin);

router.post('/login' , authGuard.notAuthTeacher , bodyParser.urlencoded({extended : true}) ,
            check('email').not().isEmpty().withMessage('email required...').isEmail().withMessage('it is not format email...') ,
            check('password').not().isEmpty().withMessage('pssword required...').isLength({min : 6}).withMessage('your password must be more than 6 charchters...') ,
            authController.postLogin);

router.all('/logout' , authGuard.isAuthTeacher , authController.logout);

router.get('/viewteacherquiz' , authGuard.isAuthTeacher, authController.viewTeacherQuizes);

router.get('/viewquizquestions/:name' , authGuard.isAuthTeacher, authController.viewQuizQuestions);

router.get('/deletequestion/:name/:id' , authGuard.isAuthTeacher, authController.deleteQuestion);

module.exports = router;