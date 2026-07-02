import { createRequire } from 'node:module';

export default defineEventHandler(async (event) => {
    const require = createRequire(import.meta.url);
    const oracledb = require('oracledb');
    const userId = getRouterParam(event, 'userId');
    const connection = await oracledb.getConnection({
        user: process.env.ORACLE_USER,
        password: process.env.ORACLE_PASSWORD,
        connectString: `${process.env.ORACLE_HOST}:${process.env.ORACLE_PORT}/${process.env.ORACLE_DATABASE}`,
    });

    try {
        const result = await connection.execute(
            'SELECT USER_ID, USER_NAME, USER_POWER, USER_PHONE FROM GO_USER WHERE USER_ID = :USER_ID',
            { USER_ID: userId },
            { outFormat: oracledb.OUT_FORMAT_OBJECT },
        );
        const user = result.rows?.[0];

        if (!user) {
            throw createError({ statusCode: 404, statusMessage: 'User not found' });
        }

        return user;
    } finally {
        await connection.close();
    }
});
