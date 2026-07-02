import { createRequire } from 'node:module';

export default defineEventHandler(async () => {
    const require = createRequire(import.meta.url);
    const oracledb = require('oracledb');
    const connection = await oracledb.getConnection({
        user: process.env.ORACLE_USER,
        password: process.env.ORACLE_PASSWORD,
        connectString: `${process.env.ORACLE_HOST}:${process.env.ORACLE_PORT}/${process.env.ORACLE_DATABASE}`,
    });

    try {
        const result = await connection.execute(
            'SELECT USER_ID, USER_NAME, USER_POWER, USER_PHONE FROM GO_USER',
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT },
        );

        return result.rows ?? [];
    } finally {
        await connection.close();
    }
});
