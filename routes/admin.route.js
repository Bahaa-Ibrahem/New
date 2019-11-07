const router     = require('express').Router();
const adminController = require('../controllers/auth.controller');
const adminGuard      = require('./guards/admin.guard');

router.get('/admin/mangmentquiz', adminGuard, adminController.getQuizes);

router.get('/admin/mangmentquiz/:id', adminGuard, adminController.posQuizes);

router.get('/admin/mangmentteacher', adminGuard, adminController.getTeachers);

router.get('/admin/mangmentteacher/:id/:isAdmin', adminGuard, adminController.posTeachers);

module.exports = router;
