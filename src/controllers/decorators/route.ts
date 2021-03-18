import "reflect-metadata";
import { Methods } from "./enums/Methods";
import { MetadataKeys } from "./enums/MetadataKeys";
import { RequestHandler } from "express";

interface RouteHandlerDescriptor extends PropertyDescriptor {
  value?: RequestHandler;
}

const routeBinder = (method: string) => {
  return (path: string) => {
    return (target: any, key: string, _desc: RouteHandlerDescriptor) => {
      Reflect.defineMetadata(MetadataKeys.path, path, target, key);
      Reflect.defineMetadata(MetadataKeys.method, method, target, key);
    }; 
  };
};

export const get = routeBinder(Methods.get);
export const put = routeBinder(Methods.put);
export const post = routeBinder(Methods.post);
export const del = routeBinder(Methods.del);
export const patch = routeBinder(Methods.patch);