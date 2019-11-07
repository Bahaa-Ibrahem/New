exports.getHome = (req , res) => {
            res.render('index' , {
                isTeacher : req.session.teacherId ,
                isStudent : req.session.isStudent ,
                isAdmin   : req.session.isAdmin,
                authError : req.flash('authError')[0],
                validationErrors : req.flash('validationErrors'),
                pageTitle : 'Home'
            })
        };