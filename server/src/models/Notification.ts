import {
    Model,
    DataTypes,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyHasAssociationMixin,
    Association,
    HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin,
    BelongsToManyCreateAssociationMixin,
    BelongsToManyGetAssociationsMixin,
  } from "sequelize";
  import sequelize from "./index";
  import { User } from "./User";

export class Notification extends Model {
    public id!: string;
    public subject!: string;
    public text!: string;
    public user_id!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getUser!: HasManyGetAssociationsMixin<User>; 

    public static associations: {
        user: Association<Notification, User>;
      };
}

    Notification.init(
        {
            id: {
                type: DataTypes.STRING(100),
                primaryKey: true,
              },
            subject: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
            },
            text: {
                type: DataTypes.STRING(500),
                allowNull: false,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
        },
        {
            tableName: "notification",
            sequelize,
        }
    );