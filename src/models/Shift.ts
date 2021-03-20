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
  import { Therapy } from "./Therapy";

  export class Shift extends Model {
    public id!: string;
    public therapy_id!: string;
    public date!: string;
    public patient_id!: string;
    public patient_name!: string;
    public status: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getUser!: HasManyGetAssociationsMixin<User>;

    public getTherapy!: HasManyGetAssociationsMixin<Therapy>;

    public static associations: {
        therapist: Association<Shift, User>;
        shifts: Association<Shift, Therapy>;
      };
}

Shift.init(
    {
        id: {
            type: DataTypes.STRING(100),
            primaryKey: true,
          },
        date: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        therapy_id: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        patient_id: {
            type: DataTypes.STRING(100),
            allowNull: true,
            defaultValue: 0,
        },
        patient_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        tableName: "shift",
        sequelize,
    }
);

/**
 * User.hasMany(Notification, { un usuario tiene notificaciones
  sourceKey: "id",          que columna de notificaciones hay que buscar
  foreignKey: "user_id",    como esta el usuario en la tabla notificaciones
  as: "notifications",      la tabla
});

Post.hasMany(Vote, {  un post tiene votos
    sourceKey: "id",  que comlumna de votos hay que buscar 
    foreignKey: "post_id" como esta el post en la tabla votos
});

User.belongsToMany(Subreddit, { un usuario pertenece a un subreddit?
  through: User_Subreddit,      tabla
  foreignKey: "UserId",         como esta el usuario en la tabla subreddit
});
 */