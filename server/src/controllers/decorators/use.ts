
import "reflect-metadata";
import { MetadataKeys } from "./enums/MetadataKeys";
import { RequestHandler } from "express";

export const use = (middleware: RequestHandler) => {
  return (target: any, key: string) => {
    const middlewares =
      Reflect.getMetadata(MetadataKeys.middleware, target, key) || [];
      Reflect.defineMetadata(
      MetadataKeys.middleware,
      [...middlewares, middleware],
      target,
      key
    );
  };
};