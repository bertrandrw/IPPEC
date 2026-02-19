import { Router } from 'express';
import multer from 'multer';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { roleMiddleware } from '../../middleware/role.middleware.js';
import { ROLES } from '../../constants/roles.js';
import { cloudinaryStorage } from '../../config/cloudinary.js';
import * as controller from './media.controller.js';

const router = Router();
const upload = multer({ storage: cloudinaryStorage });

// This route is for uploading images to be embedded WITHIN an article's content.
// Only doctors can do this.
router.post(
  '/upload',
  authMiddleware,
  roleMiddleware([ROLES.DOCTOR]),
  upload.single('image'), // 'image' is the field name the frontend must use
  controller.uploadImageController
);

export default router;
