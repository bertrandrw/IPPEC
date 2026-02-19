// src/modules/hospitals/hospital.routes.ts
import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { roleMiddleware } from '../../middleware/role.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { ROLES } from '../../constants/roles.js';
import * as controller from './hospital.controller.js';
import { updateHospitalDto } from './dto/update-hospital.dto.js';
import { listHospitalsDto } from './dto/list-hospitals.dto.js';
const router = Router();
// All hospital management routes are for Admins only
router.use(authMiddleware, roleMiddleware([ROLES.ADMIN]));
router.get('/', validate(listHospitalsDto), controller.listHospitalsController);
router.get('/:id', controller.getHospitalByIdController);
router.patch('/:id', validate(updateHospitalDto), controller.updateHospitalController);
router.delete('/:id', controller.deleteHospitalController);
export default router;
// import { Router } from 'express';
// import { authMiddleware } from '../../middleware/auth.middleware.js';
// import { roleMiddleware } from '../../middleware/role.middleware.js';
// import { validate } from '../../middleware/validate.middleware.js';
// import { ROLES } from '../../constants/roles.js';
// import * as controller from './hospital.controller.js';
// import { listHospitalsDto } from './dto/list-hospitals.dto.js'; // <-- Import new DTO
// const router = Router();
// // Secure all routes in this module for Admins only
// router.use(authMiddleware, roleMiddleware([ROLES.ADMIN]));
// // --- ADD THE NEW GET ROUTE ---
// router.get('/', validate(listHospitalsDto), controller.listHospitalsController);
// export default router;
//# sourceMappingURL=hospital.routes.js.map