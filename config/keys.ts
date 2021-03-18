import { devKeys } from "./dev";
import { prodKeys } from "./prod";

export interface Keys {
  cookieSecret: string;
  AWS_SECRET_KEY: string;
  AWS_ACCESS_KEY: string;
  AWS_BUCKET: string;
}

export const keys = (): Keys => {
  if (process.env.NODE_ENV === "production") {
    return prodKeys;
  } else {
    return devKeys;
  }
};