import "reflect-metadata";
import { AppRouter } from "../../AppRouter";
import { Methods } from "./enums/Methods";
import { MetadataKeys } from "./enums/MetadataKeys";

export const controller = (routePrefix: string) => {
  return (target: Function) => {
    const router = AppRouter.getInstance();

    for (let key in Object.getOwnPropertyDescriptors(target.prototype)) {
      const routeHandler = target.prototype[key];
      const path = Reflect.getMetadata(
        MetadataKeys.path,
        target.prototype,
        key
      );
      const method: Methods = Reflect.getMetadata(
        MetadataKeys.method,
        target.prototype,
        key
      );

      const middlewares =
        Reflect.getMetadata(MetadataKeys.middleware, target.prototype, key) ||
        [];

      if (path) {
        router[method](routePrefix + path, ...middlewares, routeHandler);
      }
    }
  };
};