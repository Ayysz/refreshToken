require('dotenv').config();
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

// initialize prisma client
const prisma = new PrismaClient();

const generateTokens = async (user) => {
    try {
        const payload = {id: user.id, roles: user.roles};
        const accessToken = jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_PRIVATE_KEY,
            {expiresIn: process.env.expiresTimeInMinute}
        );
        const refresthToken = jwt.sign(
            payload,
            process.env.REFRESH_TOKEN_PRIVATE_KEY,
            {expiresIn: process.env.expiresTimeInDay}
        );
        
        const userToken = await prisma.userToken.findUnique({where:{userId: user.id}});
        if (userToken) await prisma.userToken.delete({where: {userId: user.id}});

        // generate new userToken
        await prisma.userToken.create({
            data: {
                userId: user.id,
                token: refresthToken,
                createdAt: Date.now()
            }
        });
        return Promise.resolve({ accessToken, refresthToken});
    } catch (e) {
        return Promise.reject(e);        
    }
}

module.exports = generateTokens;