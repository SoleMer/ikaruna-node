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
  import { Therapy } from "./Therapy";
  import { Notification } from "./Notification";
  import { Question } from "./Question";
  import { Shift } from "./Shift";
  
  export class User extends Model {
    public id!: string;
    public username!: string;
    public password!: string;
    public email!: string;
    public phone!: string;
    public admin!: number;
  
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getTherapys!: HasManyGetAssociationsMixin<Therapy>;
    public addTherapys!: HasManyAddAssociationMixin<Therapy, number>;
    public hasTherapys!: HasManyHasAssociationMixin<Therapy, number>;
    public countTherapys!: HasManyCountAssociationsMixin;
    public createTherapy!: HasManyCreateAssociationMixin<Therapy>;
    public readonly Therapys?: Therapy[];
  
    public getShifts!: HasManyGetAssociationsMixin<Shift>;
    public createShift!: HasManyCreateAssociationMixin<Shift>; 
    public hasShift!: HasManyHasAssociationMixin<Shift, number>;
    public countShifts!: HasManyCountAssociationsMixin;
    public readonly Shifts?: Shift[];

    public getNotifications!: HasManyGetAssociationsMixin<Notification>;
    public addNotifications!: HasManyAddAssociationMixin<Notification, number>;
    public hasNotifications!: HasManyHasAssociationMixin<Notification, number>;
    public countNotifications!: HasManyCountAssociationsMixin;
    public creatNotifications!: HasManyCreateAssociationMixin<Notification>;
    public readonly notifications?: Notification[];
  
    public getQuestions!: HasManyGetAssociationsMixin<Question>;
    public addQuestions!: HasManyAddAssociationMixin<Question, number>;
    public hasQuestions!: HasManyHasAssociationMixin<Question, number>;
    public countQuestions!: HasManyCountAssociationsMixin;
    public createQuestion!: HasManyCreateAssociationMixin<Question>;
    public readonly Questions?: Question[];
  
    public static associations: {
      therapies: Association<User, Therapy>;
      shifts: Association<User, Shift>;
      notifications: Association<User, Notification>;
      questions: Association<User, Question>;
    };
  }
  
  User.init(
    {
      id: {
        type: DataTypes.STRING(100),
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING(22),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true,
      },
      phone: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true,
      },
      admin: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: "user",
      sequelize,
    }
  );
  
  User.hasMany(Shift, {
    sourceKey: "id",
    foreignKey: "patient_id",
    as: "shift",
  });
  User.hasMany(Notification, {
    sourceKey: "id",
    foreignKey: "user_id",
    as: "notification",
  });
  User.hasMany(Therapy, {
    sourceKey: "id",
    foreignKey: "therapist_id",
    as: "therapy",
  });
  User.hasMany(Question, {
    sourceKey: "id",
    foreignKey: "user_id",
    as: "Question",
  });
  
  User.belongsToMany(Therapy, {
    through: User_Therapy, 
    foreignKey: "therapist_id",
  });
  User.belongsToMany(Shift, {
    through: User_Shift,
    foreignKey: "Patient_id",
  });
  User.belongsToMany(Question, {
    through: User_Question, 
    foreignKey: "user_id",
  });
  User.belongsToMany(Notification, {
    through: User_Notification, 
    foreignKey: "user_id",
  });