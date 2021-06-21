import { Model, DataTypes } from "sequelize";
import { database } from "../config/database";
import { User } from "../models/user.model"

export class Micropost extends Model {
    public id!: number;
    public user_id!: number;
    public title!: string;
    public text!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export interface MicropostInterface {
    id?: number;
    user_id?: number;
    title: string;
    text: string;
    createdAt?: Date;
    updatedAt?: Date;
}

Micropost.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        title: {
            type: new DataTypes.STRING(255),
            allowNull: false
        },
        text: {
            type: new DataTypes.STRING(500),
            allowNull: false
        }
    },
    {
        tableName: "Microposts",
        sequelize: database
    }
);

Micropost.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id', as: 'poster' });


//User.sync({ force: false }).then(() => console.log("Microposts table ok!"));