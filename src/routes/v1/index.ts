import express, { Router } from 'express';
import authRoute from './auth.route';
import docsRoute from './swagger.route';
import userRoute from './user.route';
import uploadRoute from './upload.route';
import taskRoute from './task.route';
import projectRoute from './project.route';
import labelRoute from './label.route';
import tagRoute from './tag.route';

const router = express.Router();

interface IRoute {
  path: string;
  route: Router;
}

const defaultIRoute: IRoute[] = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/upload',
    route: uploadRoute,
  },
  {
    path: '/docs',
    route: docsRoute,
  },
  {
    path: '/tasks',
    route: taskRoute,
  },
  {
    path: '/projects',
    route: projectRoute,
  },
  {
    path: '/labels',
    route: labelRoute,
  },
  {
    path: '/tags',
    route: tagRoute,
  },
];

defaultIRoute.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
