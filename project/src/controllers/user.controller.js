import HttpStatus from 'http-status-codes';
import * as UserService from '../services/user.service';




export const getUser = async (req, res, next) => {
  try {
    const data = await UserService.getUser(req.body);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: data,
      message: 'User fetched successfully'
    });
  } catch (error) {
    next(error);
  }
};


export const newUser = async (req, res, next) => {
  try {
    const data = await UserService.newUser(req.body);
    res.status(HttpStatus.CREATED).json({
      code: HttpStatus.CREATED,
      data: data,
      message: 'User created successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const validateEmail=async(req,res,next)=>{
  try {
    const data = await UserService.validateEmail(req.body);
    res.status(HttpStatus.CREATED).json({
      code: HttpStatus.CREATED,
      data: data,
      message: 'Email Sent Successfully'
    });
  } catch (error) {
    next(error);
  }
}

export const forgetPassword=async(req,res,next)=>{
  try {
    const data = await UserService.forgetPassword(req.body);
    res.status(HttpStatus.CREATED).json({
      code: HttpStatus.CREATED,
      data: data,
      message: 'Email Sent Successfully'
    });
  } catch (error) {
    next(error);
  }
}
export const resetPassword=async(req,res,next)=>{
  try {
    const data = await UserService.reset(req.body);
    res.status(HttpStatus.CREATED).json({
      code: HttpStatus.CREATED,
      data: data,
      message: 'Email Sent Successfully'
    });
  } catch (error) {
    next(error);
  }
}


export const updateUser = async (req, res, next) => {
  try {
    const data = await UserService.updateUser(req.params.id, req.body);
    res.status(HttpStatus.ACCEPTED).json({
      code: HttpStatus.ACCEPTED,
      data: data,
      message: 'User updated successfully'
    });
  } catch (error) {
    next(error);
  }
};


export const deleteUser = async (req, res, next) => {
  try {
    await UserService.updateUser(req.params.id);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: [],
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
