import { Kysely, MysqlDialect, Generated, ColumnType } from "kysely";

import { createPool } from "mysql2";
import { env } from "../env/server.mjs";

interface WaitlistTable {
  id: Generated<number>;
  email: string;
  endpoint: string | null;
}

// Keys of this interface are table names.
interface Database {
  waitlist: WaitlistTable;
}

export const db = new Kysely<Database>({
  dialect: new MysqlDialect({
    pool: createPool({
      database: env.DB_NAME,
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      password: env.DB_PASS,
    }),
  }),
});
