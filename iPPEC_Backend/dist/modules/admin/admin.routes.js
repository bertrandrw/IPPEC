import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { roleMiddleware } from '../../middleware/role.middleware.js';
import { ROLES } from '../../constants/roles.js';
// import * as dto from './dto/index.js'; // Assuming you create an index.ts barrel file for DTOs
import * as controller from './admin.controller.js';
import { createHospitalDto } from './dto/create-hospital.dto.js';
import { createPharmacyDto } from './dto/create-pharmacy.dto.js';
import { createMedicineDto } from './dto/create-medicine.dto.js';
import { createDoctorDto } from './dto/create-doctor.dto.js';
import { createInsurerDto } from './dto/create-insurer.dto.js';
const router = Router();
// ALL admin routes must be protected by auth and role middleware
router.use(authMiddleware, roleMiddleware([ROLES.ADMIN]));
// User & Institution Routes
router.get('/users/pending', controller.listPendingUsersController);
router.patch('/users/:id/approve', controller.approveUserController);
// Onboarding Routes
router.post('/hospitals', validate(createHospitalDto), controller.createHospitalController);
router.post('/pharmacies', validate(createPharmacyDto), controller.createPharmacyController);
router.post('/doctors', validate(createDoctorDto), controller.createDoctorController);
router.post('/insurers', validate(createInsurerDto), controller.createInsurerController);
// Master Data Routes
router.post('/medicines', validate(createMedicineDto), controller.createMedicineController);
router.get('/medicines', controller.listAllMedicinesController);
export default router;
//# sourceMappingURL=admin.routes.js.map