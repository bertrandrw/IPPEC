// src/modules/articles/article.routes.ts
import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { roleMiddleware } from '../../middleware/role.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { ROLES } from '../../constants/roles.js';
import * as controller from './article.controller.js';
import { createArticleDto } from './dto/create-article.dto.js';
import { updateArticleDto } from './dto/update-article.dto.js';
import { listArticlesDto } from './dto/list-articles.dto.js';
import { articleParamsDto } from './dto/article-params.dto.js';

const router = Router();

// --- PUBLIC READ ROUTES ---
router.get('/', authMiddleware, validate(listArticlesDto), controller.listPublishedArticlesController);
router.get('/:id', authMiddleware, validate(articleParamsDto), controller.getPublishedArticleByIdController);

// --- DOCTOR-SPECIFIC ROUTES ---
const doctorRouter = Router();
doctorRouter.use(authMiddleware, roleMiddleware([ROLES.DOCTOR]));

doctorRouter.post('/', validate(createArticleDto), controller.createArticleController);
doctorRouter.get('/my-articles', validate(listArticlesDto), controller.listMyArticlesController);

// Combine param and body validation for the update route
const validateUpdate = validate(updateArticleDto.merge(articleParamsDto));
doctorRouter.patch('/:id', validateUpdate, controller.updateMyArticleController);

// Validate params for the delete route
doctorRouter.delete('/:id', validate(articleParamsDto), controller.deleteMyArticleController);
doctorRouter.get(
  '/:id',
  validate(articleParamsDto),
  controller.getMyArticleByIdController
);


// Mount the doctor-specific routes
router.use('/doctor', doctorRouter);

export default router;
