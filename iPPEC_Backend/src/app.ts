// src/app.ts

// --- THE DEFINITIVE FIX ---
// Use the robust `require` syntax for the main express function.
import express = require('express');
// Import ONLY the necessary types separately.
import { Application, Request, Response } from 'express';

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
import articleRouter from './modules/articles/article.routes.js';
import mediaRouter from './modules/media/media.routes.js';
import profileRouter from './modules/profile/profile.routes.js';
import { errorMiddleware } from './middleware/error.middleware.js';

// Use the 'Application' type, which is the correct interface for the app object.
const app: Application = express();

// --- Core Middleware ---
// Now app.use() will be correctly recognized.
app.use(cors());

// Helmet has been removed as requested.

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Health Check Route ---
app.get('/', (req: Request, res: Response) => {
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
app.use('/api/v1/articles', articleRouter);
app.use('/api/v1/profile', profileRouter);

app.use('/api/v1/media', mediaRouter);


// --- Global Error Handler ---
app.use(errorMiddleware);
// ... all your existing API routes (e.g., app.use('/api/auth', authRoutes))

// Add this block to serve the frontend in production
import path from 'path';

if (process.env.NODE_ENV === 'production') {
  // Serve any static files from the React app's build directory
  app.use(express.static(path.join(__dirname, '../client/build')));

  // Handle React routing, return all requests to the React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

export default app;
