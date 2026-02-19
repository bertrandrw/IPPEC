import { PrismaClient } from '@prisma/client';
import { env } from './environment.js';
import logger from './logger.js';
// CHANGE 2: Use the `Prisma` namespace to access the options type
const prismaOptions = {};
// In development, log all queries. In production, only log errors.
if (env.NODE_ENV === 'development') {
    prismaOptions.log = [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
    ];
}
else {
    prismaOptions.log = [{ emit: 'stdout', level: 'error' }];
}
const prisma = global.prisma || new PrismaClient(prismaOptions);
if (env.NODE_ENV === 'development') {
    // Subscribe to query events for logging in development
    prisma.$on('query', (e) => {
        logger.info(`Query: ${e.query}`);
        logger.info(`Params: ${e.params}`);
        logger.info(`Duration: ${e.duration}ms`);
    });
}
// Attach the client to the global object in development to prevent
// exhausting your database connection limit.
if (env.NODE_ENV !== 'production') {
    global.prisma = prisma;
}
export default prisma;
// // src/config/prisma.ts
// import { PrismaClient } from '@prisma/client';
// import { env } from './environment';
// import logger from './logger';
// // Extend the NodeJS global type to include a prisma property
// declare global {
//   // eslint-disable-next-line no-var
//   var prisma: PrismaClient | undefined;
// }
// const prismaOptions: PrismaClient.PrismaClientOptions = {};
// // In development, log all queries. In production, only log errors.
// if (env.NODE_ENV === 'development') {
//   prismaOptions.log = [
//     { emit: 'event', level: 'query' },
//     { emit: 'stdout', level: 'info' },
//     { emit: 'stdout', level: 'warn' },
//     { emit: 'stdout', level: 'error' },
//   ];
// } else {
//   prismaOptions.log = [{ emit: 'stdout', level: 'error' }];
// }
// const prisma =
//   global.prisma ||
//   new PrismaClient(prismaOptions);
// if (env.NODE_ENV === 'development') {
//   // Subscribe to query events for logging in development
//   // This gives you more detailed query logs than the standard stdout
//   prisma.$on('query' as never, (e: PrismaClient.QueryEvent) => {
//     logger.info(`Query: ${e.query}`);
//     logger.info(`Params: ${e.params}`);
//     logger.info(`Duration: ${e.duration}ms`);
//   });
// }
// // Attach the client to the global object in development to prevent
// // exhausting your database connection limit.
// if (env.NODE_ENV !== 'production') {
//   global.prisma = prisma;
// }
// export default prisma;
//# sourceMappingURL=prisma.js.map