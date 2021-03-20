import { Sequelize } from "sequelize";
import { devDbCredentials } from "../../config/dev";

const { DB_NAME, DB_USER, DB_PASSWORD } = devDbCredentials;

let sequelize: Sequelize = new Sequelize({
  database: DB_NAME,
  username: DB_USER,
  password: DB_PASSWORD,
  dialect: "postgres",
  logging: true,
});

if (process.env.DATABASE_URL) {
  try {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      protocol: "postgres",
      logging: true,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
}

export default sequelize;