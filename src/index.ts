import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import { AppRouter } from "./AppRouter";
import { initDB } from "../config/initDB";
import cpg from "connect-pg-simple";
import { Pool } from "pg";
import * as https from "https";
import * as fs from "fs";
import * as path from "path";
import { keys } from "../config/keys";

import "./controllers/LoginController";
import "./controllers/NotificationController";
import "./controllers/QuestionController";
import "./controllers/ShiftController";
import "./controllers/TherapyController";
import "./controllers/UserController";
import "./controllers/WorkshopController";

const app = express();

const { cookieSecret } = keys();

const whitelist = [
  "https://dev.mylocalsite.com:3000",
  "https://localhost:3000",
];

const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      console.log("NOT ALLOWED BY CORS");
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors());
app.set("trust proxy", 1); // As indicate by Sammy's reponse in https://stackoverflow.com/questions/44039069/express-session-secure-cookies-not-working

app.use(express.json());

if (process.env.TS_NODE_DEV) {
  const pool = new Pool({
    user: "postgres",
    password: "27072010",
    database: "postgres",
  });

  app.use(
    session({
      store: new (cpg(session))({ pool }),
      secret: cookieSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: "none",
        secure: true,
      },
    })
  );
} else {
  app.use(
    session({
      store: new (cpg(session))({
        conString: process.env.DATABASE_URL,
      }),
      secret: cookieSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: "none",
        secure: true,
      },
    })
  );
}

app.use(passport.initialize());
app.use(passport.session());

app.use(AppRouter.getInstance());

initDB(); //initialize necessary tables if not created

let port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("listening on port: ", port);
});
