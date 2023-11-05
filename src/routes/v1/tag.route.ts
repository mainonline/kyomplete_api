import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { tagController, tagValidation } from '../../modules/tag';

const router: Router = express.Router();

router
  .route('/')
  .post(auth(), validate(tagValidation.createTag), tagController.createTag)
  .get(validate(tagValidation.getTags), tagController.getTags);

router
  .route('/:id')
  .get(auth(), validate(tagValidation.getTag), tagController.getTag)
  .patch(auth(), validate(tagValidation.updateTag), tagController.updateTag)
  .delete(auth(), validate(tagValidation.deleteTag), tagController.deleteTag);

export default router;
