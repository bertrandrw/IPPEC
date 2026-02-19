// src/modules/prescriptions/prescription.routes.ts

import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { roleMiddleware } from '../../middleware/role.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { ROLES } from '../../constants/roles.js';
import * as controller from './prescription.controller.js';
import { createPrescriptionDto } from './dto/create-prescription.dto.js';
import { updatePrescriptionDto } from './dto/update-prescription.dto.js';
import { findPharmaciesDto } from './dto/find-pharmacies.dto.js';

const router = Router();

// --- Static and More Specific Routes First ---

// PATIENT: List own prescriptions
router.get(
  '/patient/me', // This is highly specific
  authMiddleware,
  roleMiddleware([ROLES.PATIENT]),
  controller.listMyPrescriptionsController
);

router.get(
  '/:prescriptionId/find-pharmacies',
  authMiddleware,
  roleMiddleware([ROLES.PATIENT]), // Only patients can find pharmacies for their own prescriptions
  validate(findPharmaciesDto),
  controller.findPharmaciesForPrescriptionController
);

// DOCTOR: List own prescriptions
router.get(
  '/my-prescriptions', // This is also specific
  authMiddleware,
  roleMiddleware([ROLES.DOCTOR]),
  controller.listMyPrescriptionsForDoctorController
);

// --- More Generic Routes ---

// DOCTOR: Create a prescription
router.post(
  '/',
  authMiddleware,
  roleMiddleware([ROLES.DOCTOR]),
  validate(createPrescriptionDto),
  controller.createPrescriptionController
);

// --- Routes with Dynamic Parameters ---

// DOCTOR: List for a specific patient
router.get(
  '/patient/:patientId', // This is dynamic, but more specific than /:id
  authMiddleware,
  roleMiddleware([ROLES.DOCTOR]),
  controller.listPatientPrescriptionsForDoctorController
);

// PHARMACIST: Get a prescription for fulfillment
router.get(
  '/pharmacist/fulfill/:id', // Specific prefix makes it non-conflicting
  authMiddleware,
  roleMiddleware([ROLES.PHARMACIST]),
  controller.getPrescriptionForFulfillmentController
);

// PHARMACIST: Fulfill a prescription
router.patch(
  '/pharmacist/fulfill/:id', // Specific prefix
  authMiddleware,
  roleMiddleware([ROLES.PHARMACIST]),
  controller.fulfillPrescriptionController
);

// DOCTOR: Cancel a prescription
router.patch(
  '/:id/cancel', // More specific than /:id
  authMiddleware,
  roleMiddleware([ROLES.DOCTOR]),
  controller.cancelMyPrescriptionController
);

// --- Most Generic Dynamic Routes (LAST) ---

// PATIENT & DOCTOR: View a single prescription
router.get(
  '/:id',
  authMiddleware,
  roleMiddleware([ROLES.PATIENT, ROLES.DOCTOR]),
  controller.getPrescriptionByIdController
);

// DOCTOR: Update a single prescription
router.patch(
  '/:id',
  authMiddleware,
  roleMiddleware([ROLES.DOCTOR]),
  validate(updatePrescriptionDto),
  controller.updateMyPrescriptionController
);

export default router;






















// // src/modules/prescriptions/prescription.routes.ts

// import { Router } from 'express';
// import { authMiddleware } from '../../middleware/auth.middleware.js';
// import { roleMiddleware } from '../../middleware/role.middleware.js';
// import { validate } from '../../middleware/validate.middleware.js';
// import { ROLES } from '../../constants/roles.js';
// import * as controller from './prescription.controller.js';
// import { createPrescriptionDto } from './dto/create-prescription.dto.js';
// import { updatePrescriptionDto } from './dto/update-prescription.dto.js'

// const router = Router(); // This is our main router

// // --- Doctor-specific Sub-router ---
// const doctorRouter = Router();
// doctorRouter.use(authMiddleware, roleMiddleware([ROLES.DOCTOR]));

// // POST /prescriptions
// doctorRouter.post('/', validate(createPrescriptionDto), controller.createPrescriptionController);

// // GET /prescriptions/my-prescriptions
// doctorRouter.get('/my-prescriptions', controller.listMyPrescriptionsForDoctorController);

// // GET /prescriptions/patient/:patientId
// doctorRouter.get('/patient/:patientId', controller.listPatientPrescriptionsForDoctorController);

// // --- NEW DOCTOR ROUTE ---
// // GET /prescriptions/doctor/:id (Specific to the doctor's view)
// doctorRouter.get('/:id', controller.getPrescriptionByIdController);

// doctorRouter.patch(
//     '/:id',
//     validate(updatePrescriptionDto),
//     controller.updateMyPrescriptionController
//   );

//   doctorRouter.patch(
//     '/:id/cancel', // A clear, action-oriented endpoint
//     controller.cancelMyPrescriptionController
//   );


// // --- Patient-specific Sub-router ---
// const patientRouter = Router();
// patientRouter.use(authMiddleware, roleMiddleware([ROLES.PATIENT]));

// // GET /prescriptions/me
// patientRouter.get('/me', controller.listMyPrescriptionsController);

// // GET /prescriptions/:id (This is the patient's view of a single prescription)
// patientRouter.get('/:id', controller.getPrescriptionByIdController); // Re-using the generic controller


// // --- Pharmacist-specific Sub-router ---
// const pharmacistRouter = Router();
// pharmacistRouter.use(authMiddleware, roleMiddleware([ROLES.PHARMACIST]));

// // GET /prescriptions/fulfill/:id
// pharmacistRouter.get('/fulfill/:id', controller.getPrescriptionForFulfillmentController);

// // PATCH /prescriptions/fulfill/:id
// pharmacistRouter.patch('/fulfill/:id', controller.fulfillPrescriptionController);


// // --- Mount all the sub-routers onto the main router ---
// // Express will check these in order.
// router.use(doctorRouter);
// router.use(patientRouter);
// router.use(pharmacistRouter);

// export default router;



















// // import { Router } from 'express';
// // import { validate } from '../../middleware/validate.middleware.js';
// // import { authMiddleware } from '../../middleware/auth.middleware.js';
// // import { roleMiddleware } from '../../middleware/role.middleware.js';
// // import { ROLES } from '../../constants/roles.js';
// // import * as controller from './prescription.controller.js';
// // import { createPrescriptionDto } from './dto/create-prescription.dto.js';

// // const router = Router();

// // // --- Doctor-specific route for CREATION ---
// // const doctorRouter = Router();
// // doctorRouter.use(authMiddleware, roleMiddleware([ROLES.DOCTOR]));


// // //create priscription

// // doctorRouter.post(
// //   '/',
// //   validate(createPrescriptionDto),
// //   controller.createPrescriptionController,
// // );


// // //view petient medical history(priscriptions)

// // doctorRouter.get(
// //   '/patient/:patientId',
// //   controller.listPatientPrescriptionsForDoctorController,
// // );

// // // --- ROUTE FOR VIEWING THEIR OWN PRESCRIPTIONS ---
// // doctorRouter.get(
// //   '/my-prescriptions', // A clear, self-documenting path
// //   // We can add a pagination DTO here for validation if needed
// //   controller.listMyPrescriptionsForDoctorController,
// // );

// // router.post(
// //   '/',
// //   authMiddleware,
// //   roleMiddleware([ROLES.DOCTOR]),
// //   validate(createPrescriptionDto),
// //   controller.createPrescriptionController,
// // );

// // // --- Patient-specific routes for VIEWING ---
// // const patientRouter = Router();
// // patientRouter.use(authMiddleware, roleMiddleware([ROLES.PATIENT]));
// // patientRouter.get('/me', controller.listMyPrescriptionsController);
// // patientRouter.get('/:id', controller.getMyPrescriptionByIdController);

// // // --- Pharmacist-specific routes for FULFILLMENT ---
// // const pharmacistRouter = Router();
// // pharmacistRouter.use(authMiddleware, roleMiddleware([ROLES.PHARMACIST]));
// // pharmacistRouter.get('/fulfill/:id', controller.getPrescriptionForFulfillmentController);
// // pharmacistRouter.patch('/fulfill/:id', controller.fulfillPrescriptionController);

// // // Mount the role-specific sub-routers
// // // router.use(patientRouter);
// // // router.use(pharmacistRouter);
// // router.use(doctorRouter);
// // router.use(patientRouter);
// // router.use(pharmacistRouter);

// // export default router;






















































// // // import { Router } from 'express';
// // // import { validate } from '../../middleware/validate.middleware.js';
// // // import { authMiddleware } from '../../middleware/auth.middleware.js';
// // // import { roleMiddleware } from '../../middleware/role.middleware.js';
// // // import { ROLES } from '../../constants/roles.js';
// // // // import * as dto from './dto/index.js'; // Assuming a barrel file for DTOs
// // // import * as controller from './prescription.controller.js';
// // // import { createPrescriptionDto } from './dto/create-prescription.dto.js';

// // // const router = Router();

// // // // --- Doctor-specific route ---
// // // // This route is only for creating prescriptions and can only be accessed by doctors.
// // // router.post(
// // //   '/',
// // //   authMiddleware,
// // //   roleMiddleware([ROLES.DOCTOR]),
// // //   validate(createPrescriptionDto),
// // //   controller.createPrescriptionController,
// // // );

// // // // --- Patient-specific routes ---
// // // // These routes are only for viewing prescriptions and can only be accessed by patients.
// // // router.get(
// // //   '/me',
// // //   authMiddleware,
// // //   roleMiddleware([ROLES.PATIENT]),
// // //   controller.listMyPrescriptionsController,
// // // );

// // // router.get(
// // //   '/:id',
// // //   authMiddleware,
// // //   roleMiddleware([ROLES.PATIENT]),
// // //   controller.getMyPrescriptionByIdController,
// // // );

// // // export default router;