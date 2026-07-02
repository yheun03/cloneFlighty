import { createRequire } from 'node:module';

export default defineEventHandler(async (event) => {
    const require = createRequire(import.meta.url);
    const oracledb = require('oracledb');
    const body = await readBody(event);
    const connection = await oracledb.getConnection({
        user: process.env.ORACLE_USER,
        password: process.env.ORACLE_PASSWORD,
        connectString: `${process.env.ORACLE_HOST}:${process.env.ORACLE_PORT}/${process.env.ORACLE_DATABASE}`,
    });

    try {
        await connection.execute(
            `INSERT INTO GO_USER (USER_ID, USER_NAME, USER_POWER, USER_PHONE)
             VALUES (:USER_ID, :USER_NAME, :USER_POWER, :USER_PHONE)`,
            body,
            { autoCommit: true },
        );

        return body;
    } finally {
        await connection.close();
    }
});
