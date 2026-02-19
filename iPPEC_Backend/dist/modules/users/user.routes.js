// src/modules/users/user.routes.ts
import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { roleMiddleware } from '../../middleware/role.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { ROLES } from '../../constants/roles.js';
import { paginationDto } from './dto/list-users.dto.js';
import * as controller from './user.controller.js';
const router = Router();
// Secure all routes in this module for Admins only
router.use(authMiddleware, roleMiddleware([ROLES.ADMIN, ROLES.DOCTOR]));
// Apply pagination validation to all GET routes
router.use(validate(paginationDto));
// Define the specific routes for each user type
router.get('/', controller.listAllUsersController);
router.get('/doctors', controller.listDoctorsController);
router.get('/pharmacists', controller.listPharmacistsController);
router.get('/patients', controller.listPatientsController);
router.get('/insurers', controller.listInsurersController);
export default router;
//# sourceMappingURL=user.routes.js.map