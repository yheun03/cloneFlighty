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
            'DELETE FROM GO_USER WHERE USER_ID = :USER_ID',
            { USER_ID: userId },
            { autoCommit: true },
        );

        if (!result.rowsAffected) {
            throw createError({ statusCode: 404, statusMessage: 'User not found' });
        }

        return { ok: true };
    } finally {
        await connection.close();
    }
});
