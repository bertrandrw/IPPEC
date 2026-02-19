import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { roleMiddleware } from '../../middleware/role.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { ROLES } from '../../constants/roles.js';
import * as controller from './pharmacist.controller.js';
import { createPharmacistDto } from './dto/create-pharmacist.dto.js';
import { updatePharmacistDto } from './dto/update-pharmacist.dto.js';

const router = Router();

// Secure all routes in this module for Admins only
router.use(authMiddleware, roleMiddleware([ROLES.ADMIN]));

// Define CRUD routes for managing pharmacists
router.post('/', validate(createPharmacistDto), controller.createPharmacistController);
router.get('/:id', controller.getPharmacistByIdController);
router.patch('/:id', validate(updatePharmacistDto), controller.updatePharmacistController);
router.delete('/:id', controller.deletePharmacistController);

export default router;