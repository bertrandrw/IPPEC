// src/modules/pharmacies/pharmacy.routes.ts
import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { roleMiddleware } from '../../middleware/role.middleware.js';
import { ROLES } from '../../constants/roles.js';
import { validate } from '../../middleware/validate.middleware.js';
import { updateInventoryDto } from './dto/update-inventory.dto.js';
import { searchPharmaciesDto } from './dto/search-pharmacies.dto.js';
import { listPharmaciesDto } from './dto/list-pharmacies.dto.js';
import { listInventoryDto } from './dto/list-inventory.dto.js';
import * as controller from './pharmacy.controller.js';
const router = Router();
// --- PUBLIC/PATIENT-FACING ROUTE ---
router.get('/search', authMiddleware, validate(searchPharmaciesDto), controller.searchPharmaciesController);
// --- PHARMACIST-ONLY ROUTES ---
const pharmacistRouter = Router();
pharmacistRouter.use(authMiddleware, roleMiddleware([ROLES.PHARMACIST, ROLES.ADMIN]));
pharmacistRouter.get('/me/inventory', validate(listInventoryDto), controller.getMyInventoryController);
pharmacistRouter.get('/', validate(listPharmaciesDto), controller.listAllPharmaciesController);
pharmacistRouter.put('/me/inventory', validate(updateInventoryDto), controller.updateMyInventoryController);
// --- ADMIN-ONLY ROUTE ---
const adminRouter = Router();
adminRouter.use(authMiddleware, roleMiddleware([ROLES.ADMIN]));
// Add the new GET route for listing all pharmacies
adminRouter.get('/', validate(listPharmaciesDto), controller.listAllPharmaciesController);
// Mount the role-specific sub-routers
router.use(pharmacistRouter);
router.use('/', adminRouter); // Mount admin routes under /admin path
export default router;
//# sourceMappingURL=pharmacy.routes.js.map