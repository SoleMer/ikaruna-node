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

    await sequelize.query(
      `
          CREATE EXTENSION IF NOT EXISTS ltree;
    
          ALTER TABLE public.comments
            ALTER COLUMN path TYPE ltree
            USING path::ltree;
    
          DROP INDEX IF EXISTS comments_path_btree;
    
          CREATE UNIQUE INDEX IF NOT EXISTS comments_path_btree ON public.comments
            USING btree (path);
    
          DROP INDEX IF EXISTS comments_path_gist;
    
          CREATE INDEX IF NOT EXISTS comments_path_gist ON public.comments
            USING gist(path);
          `
    );
  });
};