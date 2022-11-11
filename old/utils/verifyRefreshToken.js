require('dotenv').config();
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

// initialize prisma client
const prisma = new PrismaClient();

const verifyRefreshToken = async (refrshToken) => {
    const privateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY;

    return new Promise( async (resolve, reject) => {
        await prisma.userToken.findUnique()
    });

}

module.exports = verifyRefreshToken;