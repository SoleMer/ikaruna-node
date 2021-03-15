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

export class Therapy extends Model {
    public id!: string;
    public name!: string;
    public description!: string;
    public therapist_id!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getUser!: HasManyGetAssociationsMixin<User>;

    public getShifts!: HasManyGetAssociationsMixin<Shift>;
    public createShift!: HasManyCreateAssociationMixin<Shift>; 

    public static associations: {
        therapist: Association<Therapy, User>;
        shifts: Association<Therapy, Shift>;
      };
}

    Therapy.init(
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
            description: {
                type: DataTypes.STRING(500),
                allowNull: false,
            },
            therapist_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
        },
        {
            tableName: "therapy",
            sequelize,
        }
    );

    Therapy.hasMany(Shift, {
        sourceKey: "id",
        foreignKey: "therapy_id",
        as: "shift",
    });
    Therapy.belongsToMany(Shift, {
        through: Therapy_Shift, //PREGUNTAR
        foreignKey: "therapy_id", 
    });