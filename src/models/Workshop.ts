import {
    Model,
    DataTypes,
  } from "sequelize";
  import sequelize from "./index";

export class Workshop extends Model {
    public id!: string;
    public name!: string;
    public caption!: string;
    public content!: string;
    public modality!: string;
    public image!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

}

    Workshop.init(
        {
            id: {
                type: DataTypes.STRING(100),
                primaryKey: true,
              },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
            },
            caption: {
                type: DataTypes.STRING(500),
                allowNull: false,
            },
            content: {
                type: DataTypes.STRING(500),
                allowNull: false,
            },
            modality: {
                type: DataTypes.STRING(500),
                allowNull: false,
            },
            image: {
                type: DataTypes.STRING(500),
                allowNull: true,
            },
        },
        {
            tableName: "therapy",
            sequelize,
        }
    );