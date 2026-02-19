// src/modules/orders/order.routes.ts

import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { roleMiddleware } from '../../middleware/role.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { ROLES } from '../../constants/roles.js';
import * as controller from './order.controller.js';
import { createOrderDto } from './dto/create-order.dto.js';
import { updateOrderStatusDto } from './dto/update-order-status.dto.js';

const router = Router();

// --- PATIENT: CREATE ORDER ---
router.post(
  '/',
  authMiddleware,
  roleMiddleware([ROLES.PATIENT]),
  validate(createOrderDto),
  controller.createOrderController
);

// --- PATIENT: LIST OWN ORDERS (Static path, defined early) ---
router.get(
  '/', // This now becomes the patient's "list my orders" route
  authMiddleware,
  roleMiddleware([ROLES.PATIENT]),
  controller.listMyOrdersController
);

// --- PHARMACIST: LIST PHARMACY ORDERS (Specific static path) ---
router.get(
  '/pharmacy', // This specific path will now be matched correctly
  authMiddleware,
  roleMiddleware([ROLES.PHARMACIST]),
  controller.listPharmacyOrdersController
);

// --- PHARMACIST: GET/UPDATE A SPECIFIC ORDER (Specific dynamic path) ---
router.get(
  '/pharmacy/:id',
  authMiddleware,
  roleMiddleware([ROLES.PHARMACIST]),
  controller.getPharmacyOrderByIdController
);
router.patch(
  '/pharmacy/:id/status',
  authMiddleware,
  roleMiddleware([ROLES.PHARMACIST]),
  validate(updateOrderStatusDto),
  controller.updateOrderStatusController
);

// --- PATIENT: GET A SPECIFIC ORDER (Most generic dynamic route, defined LAST) ---
router.get(
  '/:id',
  authMiddleware,
  roleMiddleware([ROLES.PATIENT]),
  controller.getMyOrderByIdController
);


export default router;




















 // src/modules/orders/order.routes.ts
// import { Router } from 'express';
// import { authMiddleware } from '../../middleware/auth.middleware.js';
// import { roleMiddleware } from '../../middleware/role.middleware.js';
// import { validate } from '../../middleware/validate.middleware.js';
// import { ROLES } from '../../constants/roles.js';
// import * as controller from './order.controller.js';
// import { createOrderDto } from './dto/create-order.dto.js';
// import { updateOrderStatusDto } from './dto/update-order-status.dto.js';

// const router = Router();



// // --- PHARMACIST ROUTES ---
// const pharmacistRouter = Router();
// pharmacistRouter.use(authMiddleware, roleMiddleware([ROLES.PHARMACIST]));
// pharmacistRouter.get('/pharmacy', controller.listPharmacyOrdersController);
// pharmacistRouter.get('/pharmacy/:id', controller.getPharmacyOrderByIdController);
// pharmacistRouter.patch('/pharmacy/:id/status', validate(updateOrderStatusDto), controller.updateOrderStatusController);

// // --- PATIENT ROUTES ---
// const patientRouter = Router();
// patientRouter.use(authMiddleware, roleMiddleware([ROLES.PATIENT]));
// patientRouter.post('/', validate(createOrderDto), controller.createOrderController);
// patientRouter.get('/', controller.listMyOrdersController);
// patientRouter.get('/:id', controller.getMyOrderByIdController);



// // Mount the role-specific routers under the main /orders path
// router.use(patientRouter);
// router.use(pharmacistRouter);

// export default router;
