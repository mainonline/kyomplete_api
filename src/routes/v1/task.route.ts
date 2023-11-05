import express, { Router } from 'express';
import { auth } from '../../modules/auth';
import { validate } from '../../modules/validate';
import { taskController, taskValidation } from '../../modules/task';

const router: Router = express.Router();

router
  .route('/')
  .post(auth(), validate(taskValidation.createTask), taskController.createTask)
  .get(auth(), validate(taskValidation.getTasks), taskController.getTasks)
  .patch(auth(), validate(taskValidation.updateTask), taskController.updateTask);

router
  .route('/:id')
  .get(auth(), validate(taskValidation.getTask), taskController.getTask)
  .delete(auth(), validate(taskValidation.deleteTask), taskController.deleteTask);

router.route('/:id/complete').patch(auth(), validate(taskValidation.deleteTask), taskController.completeTask);
router.route('/:id/archive').patch(auth(), validate(taskValidation.deleteTask), taskController.archiveTask);
router.route('/:id/clone').post(auth(), validate(taskValidation.deleteTask), taskController.cloneTask);
router.route('/reorder').patch(auth(), validate(taskValidation.reorderTasks), taskController.reorderTasks);

export default router;
