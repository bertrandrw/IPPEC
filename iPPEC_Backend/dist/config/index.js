import { env } from './environment.js';
import { jwtConfig } from './jwt.js'; // This already has the correct types
import logger from './logger.js';
import prisma from './prisma.js';
// Apply the interface to the exported config object
const config = {
    env: env.NODE_ENV,
    port: env.PORT,
    jwt: jwtConfig,
    bcryptSaltRounds: env.BCRYPT_SALT_ROUNDS,
};
// Export everything as before
export { config, logger, prisma };
//# sourceMappingURL=index.js.map
const express = require("express");
const cors = require("cors");

const app = express();

/* ---------- MIDDLEWARE ---------- */
app.use(cors({
  origin: "*", // allow frontend to access backend
}));
app.use(express.json());

/* ---------- TEST ROUTE ---------- */
app.get("/", (req, res) => {
  res.send("Backend is running");
});

/* ---------- API ROUTES (example) ---------- */
app.get("/api/test", (req, res) => {
  res.json({ message: "API working" });
});

/* ---------- START SERVER (REQUIRED FOR RENDER) ---------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
