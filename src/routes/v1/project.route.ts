import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { projectController, projectValidation } from '../../modules/project';

const router: Router = express.Router();

router
  .route('/')
  .post(auth(), validate(projectValidation.createProject), projectController.createProject)
  .get(validate(projectValidation.getProjects), projectController.getProjects);

router
  .route('/:id')
  .get(auth(), validate(projectValidation.getProject), projectController.getProject)
  .patch(auth(), validate(projectValidation.updateProject), projectController.updateProject)
  .delete(auth(), validate(projectValidation.deleteProject), projectController.deleteProject);

export default router;
