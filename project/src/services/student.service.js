import sequelize from '../config/database';
const aws = require("aws-sdk");
const BUCKET = process.env.BUCKET;
aws.config.update({
    secretAccessKey: process.env.ACCESS_SECRET,
    accessKeyId: process.env.ACCESS_KEY,
    region: process.env.REGION
})
const s3 = new aws.S3({

});

const { QueryTypes } = require('sequelize');

export const availableCourses = async () => {
    var response = await sequelize.query(`

    select c.c_id,c.name,ci.instructor,c.lastDate,c.duration,c.seatsLeft,c.course_description,c.fee

    from course c
    inner join course_instructor ci
    on c.c_id=ci.c_id
    and c.seatsLeft>0`
        , {
            type: QueryTypes.SELECT
        })

    return response;

}

export const getImageById = async (id) => {
    const myBucket = BUCKET
    const myKey = id
    const signedUrlExpireSeconds = 10

    const url = s3.getSignedUrl('getObject', {
        Bucket: myBucket,
        Key: myKey,
        Expires: signedUrlExpireSeconds,


    })
    return url


}

export const myCourses = async (email) => {
    var response = await sequelize.query(`select c.c_id,c.name ,cn.notes ,ci.instructor 
    ,c.lastDate ,
     c.duration ,c.course_description ,c.url
        from course c
        inner join courses_enrolled ce
        on c.c_id=ce.c_id
        inner join course_instructor ci
        on c.c_id=ci.c_id
        inner join (select c_id,group_concat(notes) as notes from course_notes group by c_id order by c_id
    ) cn
        on cn.c_id=c.c_id
        where ce.student_id=?
        and c.seatsLeft>0 
    
  `
        , {
            replacements: [email],
            type: QueryTypes.SELECT
        })

    return response;

}

export const myProfile = async (body) => {
    var response = await sequelize.query(`select firstName,lastName,email from users where 
    email=?`
        , {
            replacements: [body.email],
            type: QueryTypes.SELECT
        })

    return response;

}

export const updateProfile = async (body) => {
    const { QueryTypes } = require('sequelize');
    var response = await sequelize.query(`update users set firstName=?,lastName=? where 
    email=?`
        , {
            replacements: [body.firstName, body.lastName, body.email],
            type: QueryTypes.SELECT
        })

    return response;

}

export const enrollInCourse = async (body) => {
    try {
        var response = await sequelize.query(`insert into courses_enrolled(c_id,student_id,status)
    values(?,?,0)`
            , {
                replacements: [body.courseId, body.studentId],
                type: QueryTypes.INSERT
            })
        if (response) {
            var updateCourseSeatsResponse = await sequelize.query(`update course set seatsLeft=seatsLeft-1 where c_id=?`
                , {
                    replacements: [body.courseId],
                    type: QueryTypes.UPDATE
                })
            var couseCertificateDownloadResponse = await sequelize.query(`insert into 
            course_certificate_download(course_id,student_id,status)
            values(?,?,0)`, {
                replacements: [body.courseId, body.studentId],
                type: QueryTypes.INSERT
            })
            if (couseCertificateDownloadResponse) {
                return 'Success'
            }
        }
    } catch (err) {
    }
}

export const getQuiz = async (courseId) => {
    var response = await sequelize.query(`
    select  qu.question_id,qu.question,q.options from quiz qu
inner join (select question_id,group_concat(options) as options
from questions group by question_id order by question_id)q
on q.question_id=qu.question_id 
where qu.c_id=? ;`
        , {
            replacements: [courseId],
            type: QueryTypes.SELECT
        })
    if (response.length < 10) {
        throw new Error("Quiz Doesn't Have Enough Questions")
    }
    console.log(response)
    let questionCount = 0;
    let questionArray = [];

    while (questionCount < 10) {
        const index = Math.floor(Math.random() * response.length);
        console.log(index, response[index].question_id)
        questionArray.push(response[index])
        response.splice(index, 1);
        response.forEach(e => console.log(e.qustion_id))
        questionCount++;
    }
    console.log(questionArray)
    return questionArray;
}

export const submitQuiz = async (req) => {
    var questionAnswersMap = new Map()
    var paramsArray = req.params.courseId.split(",")
    req.body.data.forEach((e, i) => questionAnswersMap.set(e.question_id, e.answer))
    var response = await sequelize.query(`
    select question_id,answer from quiz where c_id=?`
        , {
            replacements: [paramsArray[0]],
            type: QueryTypes.SELECT
        })
    if (response) {
        var marks = response.filter(e => questionAnswersMap.get(e.question_id) === e.answer).length
        try {
            var response = await sequelize.query(
                ` insert into certificate(course_id,student_id,status,current_marks)
    values(?,?,0,?);`,
                {
                    replacements: [paramsArray[0], paramsArray[1], marks],
                    type: QueryTypes.INSERT
                }
            );


        } catch (err) {
            var quizData = await sequelize.query(
                ` select current_marks from certificate
                where course_id=? and student_id=?
                `,
                {
                    replacements: [paramsArray[0], paramsArray[1]],
                    type: QueryTypes.SELECT
                }
            );
            const { current_marks } = quizData[0]
            console.log("currrrrrr", current_marks)
            if (marks > current_marks)
                var response = await sequelize.query(
                    ` update  certificate set previous_marks=current_marks , current_marks=?
                where course_id=? and student_id=?
                `,
                    {
                        replacements: [marks, paramsArray[0], paramsArray[1]],
                        type: QueryTypes.UPDATE
                    }
                );
        }
        return {
            marks: marks
        }
    } else {
        throw new Error('error')
    }



}

export const getHighestMarks = async (req) => {
    var paramsArray = req.params.courseId.split(",")

    var certificateResponse = await sequelize.query(`
select status,current_marks,previous_marks from certificate where course_id=? and student_id=?;`
        , {
            replacements: [paramsArray[0], paramsArray[1]],
            type: QueryTypes.SELECT
        })

    console.log("certificate Response", certificateResponse.length);
    if (certificateResponse.length == 0) {
        return -1;
    }
    const { status, current_marks, previous_marks } = certificateResponse[0]
    if (status == 0) {
        if (current_marks >= 8) {
            try {
                var certificateResponse = await sequelize.query(`
                    update certificate set status=1,previous_marks=current_marks,current_marks=0 where course_id=? and student_id=?;`
                    , {
                        replacements: [paramsArray[0], paramsArray[1]],
                        type: QueryTypes.UPDATE
                    })
            } catch (err) {
                console.log("errr", err)
            }
        }
        return current_marks
    }
    if (status == 1 && current_marks < previous_marks) {
        return -2;
    }
    return current_marks;
}

export const cancelCourse = async (req) => {
    const { QueryTypes } = require('sequelize');
    var response = await sequelize.query(`
    delete from courses_enrolled where c_id=? and student_id=?`
        , {
            replacements: [req.body.courseId, req.body.studentId],
            type: QueryTypes.DELETE
        })
    var response = await sequelize.query(`
    delete from course_certificate_download where course_id=? and student_id=?`
        , {
            replacements: [req.body.courseId, req.body.studentId],
            type: QueryTypes.DELETE
        })


    return response;
}