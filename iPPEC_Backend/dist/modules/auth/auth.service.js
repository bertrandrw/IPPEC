import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/index.js";
import { ApiError } from "../../utils/ApiError.js";
import { comparePassword, hashPassword } from "../../utils/hashing.js";
import { generateToken } from "../../utils/jwt.js";
// --- Signup Service ---
export const signup = async (input) => {
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
        where: { OR: [{ email: input.email }, { phone: input.phone }] },
    });
    if (existingUser) {
        throw new ApiError(StatusCodes.CONFLICT, "User with this email or phone already exists.");
    }
    const hashedPassword = await hashPassword(input.password);
    // Use a transaction to ensure both User and PatientProfile are created successfully.
    const user = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
            data: {
                email: input.email,
                phone: input.phone,
                password: hashedPassword,
                role: input.role,
                isVerified: true, // For simplicity, we auto-verify for now.
            },
        });
        await tx.patientProfile.create({
            data: {
                userId: newUser.id,
                fullName: input.fullName,
                dateOfBirth: input.dateOfBirth,
                sex: input.sex,
                nid: input.nid,
            },
        });
        return newUser;
    });
    // Exclude password from the returned user object
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};
// --- Login Service ---
export const login = async (input) => {
    const { emailOrPhone, password } = input;
    const user = await prisma.user.findFirst({
        where: {
            OR: [{ email: emailOrPhone }, { phone: emailOrPhone }],
        },
    });
    if (!user || !(await comparePassword(password, user.password))) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid email/phone or password.");
    }
    const token = generateToken({ id: user.id, role: user.role });
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
};
//# sourceMappingURL=auth.service.js.map