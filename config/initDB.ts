import sequelize from "../src/models/";

export const initDB = async () => {
  sequelize.sync().then(async () => {
    await sequelize.query(
      `
            CREATE TABLE IF NOT EXISTS "session" (
              "sid" varchar NOT NULL COLLATE "default" PRIMARY KEY NOT DEFERRABLE INITIALLY IMMEDIATE,
              "sess" json NOT NULL,
              "expire" timestamp(6) NOT NULL
              )
              WITH (OIDS=FALSE);
              `
    );

    await sequelize.query(
      `CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");`
    );
  });
};