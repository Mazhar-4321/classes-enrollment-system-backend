import sequelize from '../config/database';
const { QueryTypes, JSON } = require('sequelize');





export const addCourse = async (body) => {
    try {
      const { QueryTypes, JSON } = require('sequelize');
      const course_id = Date.now();
  
      // body.url = 'Youtube Video';
      body.seatsLeft = 10;
      console.log(body);
      var courseInsertResponse = await sequelize.query(
        `insert into course(c_id,name,lastDate,duration,seatsLeft,course_description,url,fee)
      values(?,?,?,?,?,?,?,?)`,
        {
          replacements: [
            course_id,
            body.name,
            body.lastDate,
            body.duration,
            body.seatsLeft,
            body.courseDescription,
            body.url,
            body.fee
          ],
          type: QueryTypes.INSERT
        }
      );
      var courseInstructorResponse = await sequelize.query(
        `insert into course_notes(c_id,notes)
      values${getMultipleValues(course_id, body.notes)}`,
        {
          replacements: [],
          type: QueryTypes.INSERT
        }
      );
      var courseInstructorResponse = await sequelize.query(
        `insert into course_instructor(c_id,instructor)
      values(?,?)`,
        {
          replacements: [course_id, body.instructorName],
          type: QueryTypes.INSERT
        }
      );
      var auditResponse = await await sequelize.query(
        `insert into audit(course_id,created_by)
      values(?,?)`,
        {
          replacements: [course_id, body.email],
          type: QueryTypes.INSERT
        }
      );
      return auditResponse;
    } catch (err) {
      console.log('err', err);
      throw new Error('invalid');
    }
};

export const updateCourse = async (req) => {
    console.log(req.body);
    try {
        const { QueryTypes, JSON } = require('sequelize');
        var courseUpdateResponse = await sequelize.query(
            `update course set name=?,lastDate=?,duration=?,course_description=?,url=?,fee=?
                where c_id=?`,
            {
                replacements: [req.body.name, req.body.lastDate, req.body.duration,
                req.body.courseDescription,req.body.url,req.body.fee, req.body.courseId],
                type: QueryTypes.UPDATE
            }
        );
        var courseInstructorResponse = await sequelize.query(
            `update course_instructor set instructor=?
                where c_id=?`,
            {
                replacements: [req.body.instructorName, req.body.courseId],
                type: QueryTypes.UPDATE
            }
        );
        var courseInstructorResponse = await sequelize.query(
            `insert into course_notes(c_id,notes)
    values${getMultipleValues(req.body.courseId, req.body.notes)}`,
            {
                replacements: [],
                type: QueryTypes.INSERT
            }
        );
        return courseInstructorResponse
    } catch (err) {
      console.log("===== ERROR====== ",err)
        throw new Error(err)
    }
  
    return null;
}

export const getCourseById = async (courseId) => {
    const { QueryTypes } = require('sequelize');
    var courses = await sequelize.query(
        `SELECT s1.notes,course.name,course.lastDate,course.duration,course.course_description,course.url,course.fee,course_instructor.instructor FROM course
        inner join course_instructor on
        course.c_id=course_instructor.c_id
        inner join (select group_concat(notes) as notes from course_notes where c_id=? group by c_id)s1
         where course.c_id=?;`,
        {
            replacements: [courseId, courseId],
            type: QueryTypes.SELECT
        }
    );
    if (courses.length > 0)
        return courses;
    else {

        var courses = await sequelize.query(
            `SELECT course.name,course.lastDate,course.duration,course.course_description,course_instructor.instructor FROM course
            inner join course_instructor on
            course.c_id=course_instructor.c_id
            
            where course.c_id=?`,
            {
                replacements: [courseId],
                type: QueryTypes.SELECT
            }
        );
        if (courses.length > 0)
            return courses;
    }
}
const getMultipleValues = (c_id, notesArray = []) => {
    var string = ''
    for (var i = 0; i < notesArray.length; i++) {
        if (i == notesArray.length - 1)
            string += `('${c_id}','${notesArray[i].path + "~" + notesArray[i].name}')`
        else
            string += `('${c_id}','${notesArray[i].path + "~" + notesArray[i].name}'),`
    }
    return string;
}
const getMultipleValuesforAWS = (c_id, notesArray = []) => {
    var string = ''
    for (var i = 0; i < notesArray.length; i++) {
        if (i == notesArray.length - 1)
            string += `('${c_id}','${notesArray[i].key}')`
        else
            string += `('${c_id}','${notesArray[i].key}'),`
    }
    return string;
}
const getMultipleValuesForQuiz = (c_id, notesArray = []) => {
    var string = ''
    for (var i = 0; i < notesArray.length; i++) {

        if (i == notesArray.length - 1)
            string += `('${c_id}','${notesArray[i].question_id}','${notesArray[i].question}','${notesArray[i].answer}')`
        else
            string += `('${c_id}','${notesArray[i].question_id}','${notesArray[i].question}','${notesArray[i].answer}'),`
    }
    return string;
}


export const deleteCourse = async (courseId) => {
    const { QueryTypes } = require('sequelize');
    var courseInsertResponse = await sequelize.query(
        `delete from course where c_id=?`,
        {
            replacements: [courseId],
            type: QueryTypes.DELETE
        }
    );
    var courseInsertResponse = await sequelize.query(
        `delete from audit where course_id=?`,
        {
            replacements: [courseId],
            type: QueryTypes.DELETE
        }
    );

}

export const deleteNoteById = async (body) => {
    const { QueryTypes } = require('sequelize');

    var courseInsertResponse = await sequelize.query(
        `delete from course_notes where c_id=? and notes=?`,
        {

            replacements: [body.courseId, body.fileId],
            type: QueryTypes.DELETE
        }
    );
    return courseInsertResponse;
}

export const getAllCourses = async (adminId) => {
    const { QueryTypes } = require('sequelize');
    var courses = await sequelize.query(
        `select c.c_id,c.name,ci.instructor,c.lastDate,c.duration,c.seatsLeft,c.course_description 
        from course c
        inner join course_instructor ci
        on c.c_id=ci.c_id
        inner join (select course_id from audit where created_by=?)s1
        on s1.course_id=c.c_id
        and c.seatsLeft>0`,
        {
            replacements: [adminId],
            type: QueryTypes.SELECT
        }
    );
    return courses;
}
const getMultipleValuesForQuestions = (questions = []) => {
    var string = ''
    for (var j = 0; j < questions.length; j++) {

        for (var i = 0; i < questions[j].options.length; i++) {

            if (j == questions.length - 1 && i == questions[j].options.length - 1)
                string += `('${questions[j].question_id}','${questions[j].options[i]}')`
            else
                string += `('${questions[j].question_id}','${questions[j].options[i]}'),`
        }
    }
    return string;
}

export const addQuiz = async (req) => {
    try {
        var courseId = req.params.id;
        const { QueryTypes } = require('sequelize');
        var quizResponse = await sequelize.query(
            `insert into quiz(c_id,question_id,question,answer)
    values ${getMultipleValuesForQuiz(courseId, req.body)}`,
            {
                replacements: [],
                type: QueryTypes.INSERT
            }
        );
        var questionsResponse = await sequelize.query(
            `insert into questions(question_id,options)
    values ${getMultipleValuesForQuestions(req.body)}`,
            {
                replacements: [],
                type: QueryTypes.INSERT
            }
        );

        return questionsResponse;
    } catch (err) {
        return 'null'
    }
}

export const getCertificateRequests = async (adminId) => {

    const { QueryTypes } = require('sequelize');
    var courses = await sequelize.query(
        `select c.name,cc.student_id from course c
    inner join audit a
    on a.course_id=c.c_id
    inner join course_certificate_request cc
    on cc.course_id=c.c_id
    where a.created_by=?`,
        {
            replacements: [adminId],
            type: QueryTypes.SELECT
        }
    );
    return courses;
}

export const getDashBoardDetails = async (adminId) => {

    const { QueryTypes } = require('sequelize');
    var courses = await sequelize.query(
        `select audit.course_id,course.name,s1.count from audit 
    inner join 
    (select count(c_id) as count,c_id  from courses_enrolled group by c_id)s1 on
    audit.course_id=s1.c_id
    inner join course on
    course.c_id=audit.course_id
    where audit.created_by=?`,
        {
            replacements: [adminId],
            type: QueryTypes.SELECT
        }
    );
    return courses;
}

export const getQuizQuestions = async (courseId) => {
    const { QueryTypes } = require('sequelize');
    var quizQuestions = await sequelize.query(
        `select  c.name,q.question_id,q.question,q.answer,o1.options from course c 
        inner join quiz q on
        c.c_id=q.c_id 
        inner join (select question_id,group_concat(options) as options from questions group by question_id)o1 
        on o1.question_id=q.question_id
        where c.c_id=?`,
        {
            replacements: [courseId],
            type: QueryTypes.SELECT
        }
    );
    return quizQuestions;
}

export const updateQuestionById = async(questionId,questionObj)=>{
    try {
        const { QueryTypes, JSON } = require('sequelize');
        var quizUpdateResponse = await sequelize.query(
            `update quiz set question=?,answer=? 
            where question_id =?`,
            {
                replacements: [questionObj.question,questionObj.answer,questionId],
                type: QueryTypes.UPDATE
            }
        );
        var deleteQuestionResponse = await sequelize.query(
            `delete from questions where question_id = ?`,
            {
                replacements: [questionId],
                type: QueryTypes.DELETE
            }
        );
        var insertQuestionResponse = await sequelize.query(
            `insert into questions(question_id,options)
            values(${questionId},?),(${questionId},?),(${questionId},?),(${questionId},?)`,
            {
                replacements: [questionObj.options[0],questionObj.options[1],questionObj.options[2],questionObj.options[3]],
                type: QueryTypes.INSERT
            }
        );
        return insertQuestionResponse
    } catch (err) {
        throw new Error(err)
    }
}

export const insertQuestion = async (courseId,questionObj)=>{
    try {
        var questionId=questionObj.question_id
        const { QueryTypes, JSON } = require('sequelize');
        var quizInsertResponse = await sequelize.query(
            `insert into quiz(c_id,question_id,question,answer)
            values(?,?,?,?) `,
            {
                replacements: [courseId,questionObj.question_id,questionObj.question,questionObj.correctAnswer],
                type: QueryTypes.INSERT
            }
        );
        var insertQuestionResponse = await sequelize.query(
            `insert into questions(question_id,options)
            values(${questionId},?),(${questionId},?),(${questionId},?),(${questionId},?)`,
            {
                replacements: [questionObj.options[0],questionObj.options[1],questionObj.options[2],questionObj.options[3]],
                type: QueryTypes.INSERT
            }
        );
        return insertQuestionResponse
    } catch (err) {
        throw new Error(err)
    }
}

export const deleteQuestionById = async(questionId)=>{
    const { QueryTypes } = require('sequelize');
    var courseInsertResponse = await sequelize.query(
        `delete  from quiz where question_id=?`,
        {
            replacements: [questionId],
            type: QueryTypes.DELETE
        }
    );
}

export const getAdminDashBoard = async (adminId) => {
    console.log("--------------------------------------------------------------")
    const { QueryTypes } = require('sequelize');
    var courses = await sequelize.query(
      `SELECT course.name,course.seatsLeft, count(courses_enrolled.c_id) as enrollments FROM express.courses_enrolled
          inner join audit on
          audit.course_id=courses_enrolled.c_id
          inner join course on
          course.c_id=audit.course_id
          where audit.created_by=?
          group by audit.course_id`,
      {
        replacements: [adminId],
        type: QueryTypes.SELECT
      }
    );
  
    console.log('courses fetched ==============>', courses);
    return courses;
};
   
export const getAdminDashBoardbox = async (adminId) => {
    const { QueryTypes } = require('sequelize');
    var courses = await sequelize.query(
      ` select COUNT( role_name ) from role where role_name = "student";`,
      {
        //replacements: [adminId],
        type: QueryTypes.SELECT
      }
    );
    
    console.log('courses fetched', courses);
    return courses;
};
  
export const getAdminDashBoardbox2 = async (adminId) => {
    const { QueryTypes } = require('sequelize');
    var courses = await sequelize.query(
      ` select COUNT( * ) from course ;`,
      {
        //replacements: [adminId],
        type: QueryTypes.SELECT
      }
    );
    
    console.log('courses fetched', courses);
    return courses;
};
  
export const getAdminDashBoardbox3 = async () => {
    const { QueryTypes } = require('sequelize');
    var courses = await sequelize.query(
      ` select COUNT( * ) from course_notes ;`,
      {
        //replacements: [adminId],
        type: QueryTypes.SELECT
      }
    );
    
    console.log('courses fetched', courses);
    return courses;
};
  
  
  //====
  