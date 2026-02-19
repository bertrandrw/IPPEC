// src/modules/insurance/insurance.routes.ts

import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { roleMiddleware } from '../../middleware/role.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { ROLES } from '../../constants/roles.js';
import { generateClaimReportDto } from './dto/generate-claim-report.dto.js';
import { generateClaimReportController } from './insurance.controller.js';
import * as controller from './insurance.controller.js';
import { createInsuranceCompanyDto } from './dto/create-insurance-company.dto.js';
import { updateInsuranceCompanyDto } from './dto/update-insurance-company.dto.js';

const router = Router();

// --- ADMIN MANAGEMENT OF INSURANCE COMPANIES ---
const adminRouter = Router();
adminRouter.use(authMiddleware, roleMiddleware([ROLES.ADMIN]));

adminRouter.post('/companies', validate(createInsuranceCompanyDto), controller.createInsuranceCompanyController);
adminRouter.get('/companies', controller.listInsuranceCompaniesController);
adminRouter.get('/companies/:id', controller.getInsuranceCompanyByIdController);
adminRouter.patch('/companies/:id', validate(updateInsuranceCompanyDto), controller.updateInsuranceCompanyController);
adminRouter.delete('/companies/:id', controller.deleteInsuranceCompanyController);

// Mount the admin-specific routes under a clear path
router.use('/admin', adminRouter);


// --- PHARMACIST CLAIM REPORT GENERATION ---
const pharmacistRouter = Router();
pharmacistRouter.use(authMiddleware, roleMiddleware([ROLES.PHARMACIST, ROLES.ADMIN]));

pharmacistRouter.post('/claims/generate-report', validate(generateClaimReportDto), generateClaimReportController);

// --- THIS IS THE FIX ---
// You must mount the pharmacistRouter onto the main router.
router.use(pharmacistRouter);


export default router;

















// import { Router } from 'express';
// import { authMiddleware } from '../../middleware//auth.middleware.js';
// import { roleMiddleware } from '../../middleware/role.middleware.js';
// import { validate } from '../../middleware/validate.middleware.js';
// import { ROLES } from '../../constants/roles.js';
// import { generateClaimReportDto } from './dto/generate-claim-report.dto.js';
// import { generateClaimReportController } from './insurance.controller.js';
// import * as controller from './insurance.controller.js';
// import { createInsuranceCompanyDto } from './dto/create-insurance-company.dto.js';
// import { updateInsuranceCompanyDto } from './dto/update-insurance-company.dto.js';

// const router = Router();

// const adminRouter = Router();
// adminRouter.use(authMiddleware, roleMiddleware([ROLES.ADMIN]));

// adminRouter.post('/companies', validate(createInsuranceCompanyDto), controller.createInsuranceCompanyController);
// adminRouter.get('/companies', controller.listInsuranceCompaniesController);
// adminRouter.get('/companies/:id', controller.getInsuranceCompanyByIdController);
// adminRouter.patch('/companies/:id', validate(updateInsuranceCompanyDto), controller.updateInsuranceCompanyController);
// adminRouter.delete('/companies/:id', controller.deleteInsuranceCompanyController);

// // Mount the admin-specific routes under a clear path
// router.use('/admin', adminRouter);


// // --- PHARMACIST CLAIM REPORT GENERATION (from previous implementation) ---
// const pharmacistRouter = Router();
// pharmacistRouter.use(authMiddleware, roleMiddleware([ROLES.PHARMACIST, ROLES.ADMIN]));

// pharmacistRouter.post('/claims/generate-report', validate(generateClaimReportDto), generateClaimReportController);


// export default router;

// // // Secure all routes for pharmacists/admins
// // router.use(authMiddleware, roleMiddleware([ROLES.PHARMACIST, ROLES.ADMIN]));

// // router.post('/claims/generate-report', validate(generateClaimReportDto), generateClaimReportController);

// // export default router;