import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { labelController, labelValidation } from '../../modules/label';

const router: Router = express.Router();

router
  .route('/')
  .post(auth(), validate(labelValidation.createLabel), labelController.createLabel)
  .get(validate(labelValidation.getLabels), labelController.getLabels);

router
  .route('/:id')
  .get(auth(), validate(labelValidation.getLabel), labelController.getLabel)
  .patch(auth(), validate(labelValidation.updateLabel), labelController.updateLabel)
  .delete(auth(), validate(labelValidation.deleteLabel), labelController.deleteLabel);

export default router;
