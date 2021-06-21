import { Model, DataTypes } from "sequelize";
import { database } from "../config/database";

export class User extends Model {
    public id!: number;
    public userName!: string;
    public firstName!: string;
    public lastName!: string;
    public email!: string;
    public pwdHash!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export interface UserInterface {
    id?: number;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    pwdHash: string;
    createdAt?: Date;
    updatedAt?: Date;
    avatar?: string;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userName: {
            type: new DataTypes.STRING(255),
            allowNull: false
        },
        firstName: {
            type: new DataTypes.STRING(255),
            allowNull: false
        },
        lastName: {
            type: new DataTypes.STRING(255),
            allowNull: false
        },
        email: {
            type: new DataTypes.STRING(255),
            allowNull: false
        },
        pwdHash: {
            type: new DataTypes.STRING(255),
            allowNull: false
        }
    },
    {
        tableName: "Users",
        sequelize: database
    }
);

//User.sync({ force: false }).then(() => console.log("Users table ok!"));