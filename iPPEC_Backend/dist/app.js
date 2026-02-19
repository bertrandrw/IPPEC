// src/app.ts
import { createRequire as _createRequire } from "module";
const __require = _createRequire(import.meta.url);
// --- THE DEFINITIVE FIX ---
// Use the robust `require` syntax for the main express function.
const express = __require("express");
// Other imports
import cors from 'cors';
import { StatusCodes } from 'http-status-codes';
import 'express-async-errors';
import authRouter from './modules/auth/auth.routes.js';
import userRouter from './modules/users/user.routes.js';
import adminRouter from './modules/admin/admin.routes.js';
import patientRouter from './modules/patients/patient.routes.js';
import pharmacistsRouter from './modules/pharmacists/pharmacist.routes.js';
import medicineRouter from './modules/medicines/medicine.routes.js';
import hospitalRouter from './modules/hospitals/hospital.routes.js';
import insuranceRouter from './modules/insurance/insurance.routes.js';
import pharmacyRouter from './modules/pharmacies/pharmacy.routes.js';
import prescriptionRouter from './modules/prescriptions/prescription.routes.js';
import orderRouter from './modules/orders/order.routes.js';
import insurerRouter from './modules/insurers/insurer.routes.js';
import { errorMiddleware } from './middleware/error.middleware.js';
// Use the 'Application' type, which is the correct interface for the app object.
const app = express();
// --- Core Middleware ---
// Now app.use() will be correctly recognized.
app.use(cors());
// Helmet has been removed as requested.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// --- Health Check Route ---
app.get('/', (req, res) => {
    res.status(StatusCodes.OK).send('Health Prescription Backend is up and running!');
});
// --- API Routes ---
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/patients', patientRouter);
app.use('/api/v1/portal/insurer', insurerRouter);
app.use('/api/v1/pharmacists', pharmacistsRouter);
app.use('/api/v1/hospitals', hospitalRouter);
app.use('/api/v1/insurance', insuranceRouter);
app.use('/api/v1/pharmacies', pharmacyRouter);
app.use('/api/v1/medicines', medicineRouter);
app.use('/api/v1/prescriptions', prescriptionRouter);
// --- Global Error Handler ---
app.use(errorMiddleware);
export default app;
//# sourceMappingURL=app.js.map