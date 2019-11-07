exports.isAuthTeacher = (req , res , next) => {
    if(req.session.teacherId)  next();
    else res.redirect('/login');
};

exports.notAuthTeacher = (req , res , next) => {
    if(!req.session.teacherId) next();
    else res.redirect('/');
}

exports.isAuthStudent = (req , res , next) => {
    if(req.session.isStudent)  next();
    else res.redirect('/login');
};

exports.notAuthStudent = (req , res , next) => {
    if(!req.session.isStudent) next();
    else res.redirect('/');
}
