import sequelize from '../config/database';
import { sendEmail } from '../utils/user.util';
import Jwt from 'jsonwebtoken';
const bcrypt = require('bcrypt');
const { QueryTypes } = require('sequelize');





export const getAdmins = async (flag) => {
  var response = await sequelize.query(
    `select u.firstName,u.lastName,u.email from users u 
    inner join privilige p 
    on p.admin_email=u.email 
    where p.status = ?;`,
    {
      replacements: [flag],
      type: QueryTypes.SELECT
    }
  );
  return response

};

export const updateAdmin = async (flag,admin_email)=>{
    var response = await sequelize.query(
        `update privilige set status =?  where admin_email=?`,
        {
          replacements: [flag,admin_email],
          type: QueryTypes.UPDATE
        }
      );
      return response
}


