const router = require('express').Router();
const quizesController = require('../controllers/quizes.controller');
const authGuard = require('./guards/auth.guard');
const adminGuard = require('./guards/admin.guard');

router.get('/', authGuard.isAuthStudent, quizesController.getQuizes);

router.get('/:name', authGuard.isAuthStudent, quizesController.viewQuiz);

router.get('/admin/:name', adminGuard, quizesController.viewQuiz);

module.exports = router;