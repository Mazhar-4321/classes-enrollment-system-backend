import express from 'express';
const router = express.Router();

import userRoute from './user.route';
import studentRoute from './student.route'
import adminRoute from './admin.route'
import superRoute from './super.route'
/**
 * Function contains Application routes
 *
 * @returns router
 */
const routes = () => {
  router.get('/', (req, res) => {
    res.json('Welcome');
  });
  router.use('/users', userRoute);
  router.use('/students', studentRoute);
  router.use('/admins', adminRoute);
  router.use('/super', superRoute);

  return router;
};

export default routes;
