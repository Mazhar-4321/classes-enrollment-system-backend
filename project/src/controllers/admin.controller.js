import HttpStatus from 'http-status-codes';
import * as AdminService from '../services/admin.service'


export const addCourse = async (req, res, next) => {
  try {
    req.files=[{key:"a"},{key:"a1"},{key:"a11"},{key:"a111"}]
    await AdminService.addCourse(req.body, req.files);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: [],
      message: 'Courses Added successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    var data = await AdminService.updateCourse(req);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: data,
      message: 'Courses Added successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const checkFiles = async (req, res, next) => {
  try {
    await AdminService.checkFiles(req.body);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: data,
      message: 'Courses Added successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getCourseById = async (req, res, next) => {
  try {
    var data = await AdminService.getCourseById(req.params.id);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: data,
      message: 'Courses Added successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    await AdminService.deleteCourse(req.params.id);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: [],
      message: 'Courses Deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNoteById = async (req, res, next) => {
  try {
    await AdminService.deleteNoteById(req.body);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: [],
      message: 'Courses Deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCourses = async (req, res, next) => {
  try {
    var data = await AdminService.getAllCourses(req.params.id);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: data,
      message: 'Courses Fetched successfully'
    });
  } catch (error) {
    next(error);
  }
}

export const addQuiz = async (req, res, next) => {
  try {
    var data = await AdminService.addQuiz(req);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: data,
      message: 'Courses Fetched successfully'
    });
  } catch (error) {
    next(error);
  }
}

export const getCertificateRequests = async (req, res, next) => {
  try {
    var data = await AdminService.getCertificateRequests(req.params.id);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: data,
      message: 'Courses Fetched successfully'
    });
  } catch (error) {
    next(error);
  }
}

export const getDashBoardDetails = async (req, res, next) => {
  try {
    var data = await AdminService.getDashBoardDetails(req.params.id);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: data,
      message: 'Courses Fetched successfully'
    });
  } catch (error) {
    next(error);
  }
}

export const getQuizQuestions = async (req, res, next) => {
  try {
    var data = await AdminService.getQuizQuestions(req.params.id);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: data,
      message: 'Quiz Questions Fetched successfully'
    });
  } catch (error) {
    next(error);
  }
}

export const updateQuestionById = async (req, res, next) => {
  var courseId = req.params.courseId;
  var questionObj = req.body;
  var data = await AdminService.updateQuestionById(req.params.courseId, req.body);
  res.status(HttpStatus.OK).json({
    code: HttpStatus.OK,
    data: data,
    message: 'Quiz updated successfully'
  });
}

export const insertQuestion = async (req, res, next) => {
  var courseId = req.params.courseId;
  var questionObj = req.body;
  var data = await AdminService.insertQuestion(courseId, req.body);
  res.status(HttpStatus.OK).json({
    code: HttpStatus.OK,
    data: data,
    message: 'Quiz updated successfully'
  });
}

export const deleteQuestionById = async (req, res, next) => {
  try {
    await AdminService.deleteQuestionById(req.params.questionId);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: [],
      message: 'Courses Deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminDashBoard = async (req, res, next) => {
  try {
    var data = await AdminService.getAdminDashBoard(req.params.id);
    console.log('data sent ===================>', data);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: data,
      message: 'DashBoard Details Fetched Succesfully.'
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminDashBoardbox = async (req, res, next) => {
  try {
    var data = await AdminService.getAdminDashBoardbox(req.params.id);
    console.log('data sent box', data);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: data,
      message: 'DashBoard Details Fetched Succesfully.'
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminDashBoardbox2 = async (req, res, next) => {
  try {
    var data = await AdminService.getAdminDashBoardbox2(req.params.id);
    console.log('data sent box', data);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: data,
      message: 'DashBoard Details Fetched Succesfully.'
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminDashBoardbox3 = async (req, res, next) => {
  try {
    var data = await AdminService.getAdminDashBoardbox3(req.params.id);
    console.log('data sent box', data);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: data,
      message: 'DashBoard Details Fetched Succesfully.'
    });
  } catch (error) {
    next(error);
  }
};