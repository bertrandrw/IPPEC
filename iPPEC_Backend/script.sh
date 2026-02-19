#!/bin/bash

echo "Creating project structure for health-prescription-backend..."

# Create root level files
echo "Creating root files..."
touch .env .env.example .gitignore .dockerignore Dockerfile docker-compose.yml package.json tsconfig.json README.md

# Create root level directories
echo "Creating root directories..."
mkdir -p prisma src tests

# --- Prisma ---
echo "Creating prisma files..."
touch prisma/schema.prisma

# --- Src Directory ---
echo "Creating src core files..."
touch src/app.ts src/server.ts

echo "Creating src subdirectories..."
mkdir -p src/config \
         src/modules \
         src/middleware \
         src/utils \
         src/types \
         src/constants

# --- Src/Config ---
echo "Creating config files..."
touch src/config/index.ts \
      src/config/environment.ts \
      src/config/prisma.ts \
      src/config/jwt.ts \
      src/config/logger.ts

# --- Src/Modules ---
echo "Creating modules structure based on app requirements..."

# Auth Module (Login, Signup, Password Reset)
mkdir -p src/modules/auth/dto
touch src/modules/auth/auth.controller.ts \
      src/modules/auth/auth.service.ts \
      src/modules/auth/auth.routes.ts \
      src/modules/auth/dto/login.dto.ts \
      src/modules/auth/dto/signup.dto.ts

# Patients Module (Profile Management)
mkdir -p src/modules/patients/dto
touch src/modules/patients/patient.controller.ts \
      src/modules/patients/patient.service.ts \
      src/modules/patients/patient.routes.ts \
      src/modules/patients/dto/update-profile.dto.ts \
      src/modules/patients/dto/add-insurance.dto.ts

# Doctors Module (Managed by Admin)
mkdir -p src/modules/doctors/dto
touch src/modules/doctors/doctor.controller.ts \
      src/modules/doctors/doctor.service.ts \
      src/modules/doctors/doctor.routes.ts \
      src/modules/doctors/dto/create-doctor.dto.ts

# Pharmacists Module (Managed by Pharmacy Admin)
mkdir -p src/modules/pharmacists/dto
touch src/modules/pharmacists/pharmacist.controller.ts \
      src/modules/pharmacists/pharmacist.service.ts \
      src/modules/pharmacists/pharmacist.routes.ts \
      src/modules/pharmacists/dto/create-pharmacist.dto.ts

# Prescriptions Module (Core Logic)
mkdir -p src/modules/prescriptions/dto
touch src/modules/prescriptions/prescription.controller.ts \
      src/modules/prescriptions/prescription.service.ts \
      src/modules/prescriptions/prescription.repository.ts \
      src/modules/prescriptions/prescription.routes.ts \
      src/modules/prescriptions/dto/create-prescription.dto.ts

# Pharmacies Module (Registration, Inventory, Location)
mkdir -p src/modules/pharmacies/dto
touch src/modules/pharmacies/pharmacy.controller.ts \
      src/modules/pharmacies/pharmacy.service.ts \
      src/modules/pharmacies/pharmacy.routes.ts \
      src/modules/pharmacies/dto/register-pharmacy.dto.ts \
      src/modules/pharmacies/dto/update-inventory.dto.ts

# Hospitals Module (Registration, Doctor Association)
mkdir -p src/modules/hospitals/dto
touch src/modules/hospitals/hospital.controller.ts \
      src/modules/hospitals/hospital.service.ts \
      src/modules/hospitals/hospital.routes.ts \
      src/modules/hospitals/dto/register-hospital.dto.ts

# Insurance Module (Company Management, Claims)
mkdir -p src/modules/insurance/dto
touch src/modules/insurance/insurance.controller.ts \
      src/modules/insurance/insurance.service.ts \
      src/modules/insurance/insurance.routes.ts \
      src/modules/insurance/dto/register-insurance.dto.ts \
      src/modules/insurance/dto/generate-claim.dto.ts

# Medicines Module (Master Drug List, managed by Admin)
mkdir -p src/modules/medicines/dto
touch src/modules/medicines/medicine.controller.ts \
      src/modules/medicines/medicine.service.ts \
      src/modules/medicines/medicine.routes.ts \
      src/modules/medicines/dto/create-medicine.dto.ts

# Admin Module (Verification, Onboarding, Dashboards)
mkdir -p src/modules/admin/dto
touch src/modules/admin/admin.controller.ts \
      src/modules/admin/admin.service.ts \
      src/modules/admin/admin.routes.ts \
      src/modules/admin/dto/approve-registration.dto.ts

# --- Src/Middleware ---
echo "Creating middleware files..."
touch src/middleware/auth.middleware.ts \
      src/middleware/role.middleware.ts \
      src/middleware/error.middleware.ts \
      src/middleware/validate.middleware.ts

# --- Src/Utils ---
echo "Creating util files..."
touch src/utils/ApiError.ts \
      src/utils/ApiResponse.ts \
      src/utils/catchAsync.ts \
      src/utils/pick.ts \
      src/utils/jwt.ts \
      src/utils/hashing.ts

# --- Src/Types ---
echo "Creating type definition files..."
mkdir -p src/types/express
touch src/types/express/index.d.ts \
      src/types/jwt.payload.ts

# --- Src/Constants ---
echo "Creating constants files..."
touch src/constants/roles.ts \
      src/constants/.gitkeep

# --- Tests ---
echo "Creating tests structure..."
mkdir -p tests/integration tests/unit
touch tests/integration/prescription.test.ts \
      tests/unit/prescription.service.test.ts \
      tests/.gitkeep tests/integration/.gitkeep tests/unit/.gitkeep


echo "✅ Project structure for health-prescription-backend created successfully!"
echo ""
echo "Next steps:"
echo "1. Run 'npm init -y' and install dependencies (express, prisma, typescript, etc.)."
echo "2. Populate 'package.json' with scripts (dev, build, start, test)."
echo "3. Configure '.env' with DATABASE_URL, JWT_SECRET, etc."
echo "4. Populate 'tsconfig.json' for the project."
echo "5. Add the data models to 'prisma/schema.prisma' and run 'npx prisma generate'."
echo "6. Start building the application, beginning with the Auth module!"

exit 0