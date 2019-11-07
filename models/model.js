const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const DB_URL = 'mongodb+srv://Bahaa:112314516@cluster0-60txf.mongodb.net/quiz?retryWrites=true&w=majority';

/*-----------------------------Teacher Models-------------------------------------------*/

const teacherSchema = mongoose.Schema({
    username  : String,
    email     : String,
    password  : String,
    isAdmin   : {
        type : Boolean,
        defult : false
    },
    isStudent : Boolean
});

const Teacher = mongoose.model('teacher',teacherSchema);

exports.createNew = (username, email, password, isStudent) => {
    return new Promise((resolve , reject) => {
        mongoose.connect(DB_URL).then(() => {
            Teacher.findOne({email : email});
        }).then((teacher) => {
            if(teacher){
                mongoose.disconnect();
                reject('E-mail is used...');
            } 
            else{
                if(isStudent == "on")  isStudent = true
                else isStudent = false
                console.log(isStudent);
                return bcrypt.hash(password , 10).then((hashedpassword) => {
                    let teacher = new Teacher({
                        username  : username,
                        email     : email,
                        password  : hashedpassword,
                        isAdmin   : false,
                        isStudent : isStudent
                    });
                    return teacher.save();
                }).then(() => {
                    mongoose.disconnect();
                    resolve();
                }).catch((err) => {
                    mongoose.disconnect();
                    reject(err);
                });
            }
        });
    });
};

exports.login = (email , password) => {
    return new Promise((resolve , reject) => {
        mongoose.connect(DB_URL).then(() => Teacher.findOne({email : email}))
        .then((teacher) => { 
            if(!teacher){
                mongoose.disconnect();
                reject('There is no teacher matches this email');
            }else{
                  bcrypt.compare(password , teacher.password).then(same => {
                    if(!same){
                        mongoose.disconnect();
                        reject('Password is incorrect');
                    }else{
                        mongoose.disconnect();
                        resolve({
                            id : teacher._id,
                            isAdmin : teacher.isAdmin,
                            isStudent : teacher.isStudent
                        });
                    }
                })
            }
        }).catch((err) => {
            mongoose.disconnect();
            reject(err);  
        });
    });
};

exports.getTeachers = () => {
    return new Promise((resolve , reject) => {
        mongoose.connect(DB_URL).then(() => {
            return Teacher.find({});
        })
        .then((items) => {
            mongoose.disconnect();
            resolve(items);
        })
        .catch((err) => {
            mongoose.disconnect();
            console.log(err);
        })
    });
};

exports.deleteTeacher = (id) => {
    return new Promise((resolve , reject) => {
        mongoose.connect(DB_URL).then(() => {
            return Teacher.findByIdAndDelete(id);
        })
        .then(() => { 
            mongoose.disconnect();
            resolve();
         })
        .catch((err) => {
            mongoose.disconnect();
            reject(err);
            console.log(err);
        })

    });
};

/*-----------------------------Quizes Models-------------------------------------------*/

const quizSchema = mongoose.Schema({
    quizname  : String,
    teacherId : String,
    timestamp : String
});

const Quiz = mongoose.model('quiz', quizSchema);

const saveQuizSchema = mongoose.Schema({
    quizname  : String,
    teacherId : String,
    timestamp : String
});

const SaveQuiz = mongoose.model('savequiz', saveQuizSchema);

exports.saveNewQuiz = (data) => {
    return new Promise((resolve , reject) => {
        mongoose.connect(DB_URL).then(() => {
            let id = data._id; 
            return SaveQuiz.findOne({_id : id});
        }).then((quiz) => {
            if(!quiz){
                let quiz = new SaveQuiz(data);
                return quiz.save(); 
            } 
            else{
                mongoose.disconnect();
                reject('This quiz aready published...');     
            }
        }).then(() => {
            mongoose.disconnect();
             resolve();
        })
        .catch((err) => {
            mongoose.disconnect();
            reject(err);
        });
    });
};

exports.deleteNewQuiz = (id) => {
    return new Promise((resolve , reject) => {
        mongoose.connect(DB_URL).then(() => {
            return Quiz.findByIdAndDelete(id);
        })
        .then(() => { 
            mongoose.disconnect();
            resolve();
         })
        .catch((err) => {
            mongoose.disconnect();
            reject(err);
            console.log(err);
        })

    });
};

exports.addNewQuiz = (data) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL).then(() => {
            let quiz = new Quiz(data);
            return quiz.save();
        })
        .then((quiz) => {
            mongoose.disconnect();
            resolve(quiz.quizname);
        })
        .catch((err) => {
            mongoose.disconnect();
            reject(err);
    })
});
};

exports.getTeacherQuizes = (id) => {
    return new Promise((resolve , reject) => {
        mongoose.connect(DB_URL).then(() => {
            return Quiz.find({teacherId : id});
        })
        .then((items) => {
            mongoose.disconnect();
            resolve(items);
        })
        .catch((err) => {
            mongoose.disconnect();
            console.log(err);
        })
    });
};

exports.getQuizes = () => {
    return new Promise((resolve , reject) => {
        mongoose.connect(DB_URL).then(() => {
            return SaveQuiz.find({}); //must get data from SaveQuiz
        })
        .then((items) => {
            mongoose.disconnect();
            resolve(items);
        })
        .catch((err) => {
            mongoose.disconnect();
            console.log(err);
        })
    });
};

exports.deleteQuiz = (id) => {
    return new Promise((resolve , reject) => {
        mongoose.connect(DB_URL).then(() => {
            return SaveQuiz.findByIdAndDelete(id);
        })
        .then(() => { 
            mongoose.disconnect();
            resolve();
         })
        .catch((err) => {
            mongoose.disconnect();
            reject(err);
            console.log(err);
        })

    });
};

/*-----------------------------Questions Models-------------------------------------------*/

const questionSchema = mongoose.Schema({
    question    : String,
    posans1     : String,
    posans2     : String,
    posans3     : String,
    correctans  : String,
    descreption : String,
    teacherId   : String,
    quizname    : String,
    timestamp   : String
});

const Question = mongoose.model('question', questionSchema);

exports.addNewQuestion = (data) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL).then(() => {
            let question = new Question(data);
            return question.save();
        })
    .then(() => {
        mongoose.disconnect();
        resolve();
    })
    .catch((err) => {
        mongoose.disconnect();
        reject(err);
    })
});
};

exports.viewQuiz = (qname) => {
    return new Promise((resolve , reject) => {
        mongoose.connect(DB_URL).then(() => {
            return Question.find({quizname : qname});
        })
        .then((questions) => {
            mongoose.disconnect();
            resolve(questions);
        })
        .catch((err) => {
            mongoose.disconnect();
            console.log(err);
        })
    });
};

exports.deleteQuestion = (id) => {
    return new Promise((resolve , reject) => {
        mongoose.connect(DB_URL).then(() => {
            return Question.findByIdAndDelete(id);
        })
        .then(() => { 
            mongoose.disconnect();
            resolve();
         })
        .catch((err) => {
            mongoose.disconnect();
            reject(err);
            console.log(err);
        })

    });
};