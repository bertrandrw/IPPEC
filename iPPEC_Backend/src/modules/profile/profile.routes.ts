// src/modules/profile/profile.routes.ts

import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import * as controller from './profile.controller.js';
import { validate } from '../../middleware/validate.middleware.js';
import { updateMyProfileDto } from './dto/update-my-profile.dto.js';

const router = Router();

// This middleware ensures a user is logged in for all routes in this file.
router.use(authMiddleware);

// Define the routes for getting and updating the user's own profile.
router.get('/me', controller.getMyProfileController);
router.patch('/me', validate(updateMyProfileDto), controller.updateMyProfileController);

export default router;
