import { Router } from 'express';
import multer from 'multer';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { roleMiddleware } from '../../middleware/role.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { ROLES } from '../../constants/roles.js';
import * as controller from './medicine.controller.js';
import { createMedicineDto } from './dto/create-medicine.dto.js';
import { updateMedicineDto } from './dto/update-medicine.dto.js';
import { listMedicinesDto } from './dto/list-medicines.dto.js'; 

// Configure multer for in-memory file storage. It will not save files to disk.
const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

// Secure all medicine management routes for Admins only
router.use(authMiddleware, roleMiddleware([ROLES.ADMIN, ROLES.DOCTOR, ROLES.PATIENT]));

// --- BULK IMPORT ROUTE ---
// The `upload.single('file')` middleware handles the file upload before our controller runs.
// 'file' is the field name the frontend must use in the form-data request.
router.post('/bulk-import', upload.single('file'), controller.bulkImportController);

// --- SINGLE-ENTRY CRUD ROUTES ---
router.post('/', validate(createMedicineDto), controller.createMedicineController);
router.get('/',validate(listMedicinesDto), controller.getAllMedicinesController);
router.get('/:id', controller.getMedicineByIdController);
router.patch('/:id', validate(updateMedicineDto), controller.updateMedicineController);
router.delete('/:id', controller.deleteMedicineController);

export default router;
