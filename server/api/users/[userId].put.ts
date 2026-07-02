import { createRequire } from 'node:module';

export default defineEventHandler(async (event) => {
    const require = createRequire(import.meta.url);
    const oracledb = require('oracledb');
    const userId = getRouterParam(event, 'userId');
    const body = await readBody(event);
    const connection = await oracledb.getConnection({
        user: process.env.ORACLE_USER,
        password: process.env.ORACLE_PASSWORD,
        connectString: `${process.env.ORACLE_HOST}:${process.env.ORACLE_PORT}/${process.env.ORACLE_DATABASE}`,
    });

    try {
        const result = await connection.execute(
            `UPDATE GO_USER
             SET USER_NAME = :USER_NAME,
                 USER_POWER = :USER_POWER,
                 USER_PHONE = :USER_PHONE
             WHERE USER_ID = :USER_ID`,
            {
                USER_ID: userId,
                USER_NAME: body.USER_NAME,
                USER_POWER: body.USER_POWER,
                USER_PHONE: body.USER_PHONE,
            },
            { autoCommit: true },
        );

        if (!result.rowsAffected) {
            throw createError({ statusCode: 404, statusMessage: 'User not found' });
        }

        return { ...body, USER_ID: userId };
    } finally {
        await connection.close();
    }
});
