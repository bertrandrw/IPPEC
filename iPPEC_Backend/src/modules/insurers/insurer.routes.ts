// src/modules/insurers/insurer.routes.ts

import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { roleMiddleware } from '../../middleware/role.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { ROLES } from '../../constants/roles.js';
import * as controller from './insurer.controller.js';
import { updateClaimStatusDto } from './dto/update-claim-status.dto.js';
import { listPharmaciesDto } from './dto/list-pharmacies.dto.js';
import { createAgreementDto } from './dto/create-agreement.dto.js';
import { adjudicateItemDto } from './dto/adjudicate-item.dto.js';
import { listClaimsDto } from './dto/list-claims.dto.js';
import { findPatientDto } from './dto/find-patient.dto.js';
import { addPatientCoverageDto } from './dto/add-patient-coverage.dto.js';

const router = Router();

// Secure all routes in this module for Insurers only
router.use(authMiddleware, roleMiddleware([ROLES.INSURER]));

// --- Routes for Network Management ---
router.post('/pharmacies', validate(createAgreementDto), controller.addPharmacyToNetworkController);
router.get('/pharmacies', validate(listPharmaciesDto), controller.listNetworkPharmaciesController);
router.delete('/pharmacies/:pharmacyId', controller.removePharmacyFromNetworkController);

// --- ROUTE FOR LINE-ITEM ADJUDICATION
router.patch('/claim-items/:itemId/adjudicate', validate(adjudicateItemDto), controller.adjudicateClaimItemController);

// --- Routes for Claims Management ---
router.get('/claims',validate(listClaimsDto), controller.listCompanyClaimsController);
router.get('/claims/:id', controller.getClaimDetailsController);
router.patch('/claims/:id/status', validate(updateClaimStatusDto), controller.updateClaimStatusController);

// --- Route for Listing Network Pharmacies ---
router.get('/pharmacies', validate(listPharmaciesDto), controller.listNetworkPharmaciesController);
// --- PATIENT ROSTER MANAGEMENT ---
// This endpoint allows an insurer to search for a patient in the system.
router.get(
    '/patients/find',
    validate(findPatientDto), // Apply validation
    controller.findPatientByNid
  );
  
  router.post('/patients/coverage', validate(addPatientCoverageDto), controller.addPatientToCoverageController);
  router.delete('/patients/:patientProfileId/coverage', controller.removePatientFromCoverageController);
  

export default router;
