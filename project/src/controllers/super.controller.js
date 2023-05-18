import HttpStatus from 'http-status-codes';
import * as SuperService from '../services/super.service';




export const getAdminsForApproval = async (req, res, next) => {
  try {
    const data = await SuperService.getAdmins(0);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: data,
      message: 'User fetched successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminsForRejection = async (req, res, next) => {
    try {
      const data = await SuperService.getAdmins(1);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: data,
        message: 'User fetched successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  export const grantAdminPrivilige = async (req, res, next) => {
    try {
      const data = await SuperService.updateAdmin(1,req.params.adminEmail);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: data,
        message: 'User fetched successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  export const removeAdminPrivilige = async (req, res, next) => {
    try {
      const data = await SuperService.updateAdmin(0,req.params.adminEmail);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: data,
        message: 'User fetched successfully'
      });
    } catch (error) {
      next(error);
    }
  };


