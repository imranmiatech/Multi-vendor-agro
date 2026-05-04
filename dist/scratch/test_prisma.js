"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
require("dotenv/config");
console.log('DATABASE_URL:', process.env.DATABASE_URL);
try {
    const prisma = new client_1.PrismaClient({
        datasourceUrl: process.env.DATABASE_URL
    });
    console.log('PrismaClient instantiated with datasourceUrl');
}
catch (e) {
    console.error('Failed with datasourceUrl:', e.message);
}
try {
    const prisma = new client_1.PrismaClient({
        datasources: {
            db: {
                url: process.env.DATABASE_URL
            }
        }
    });
    console.log('PrismaClient instantiated with datasources');
}
catch (e) {
    console.error('Failed with datasources:', e.message);
}
//# sourceMappingURL=test_prisma.js.map