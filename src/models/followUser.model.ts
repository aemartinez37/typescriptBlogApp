import { Model, DataTypes } from "sequelize";
import { database } from "../config/database";
import { User } from "../models/user.model"

export class FollowUser extends Model {
    public id!: number;
    public user_id!: number;
    public followed_user_id!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export interface FollowUserInterface {
    id?: number;
    user_id?: number;
    followed_user_id?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

FollowUser.init(
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
        followed_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        tableName: "FollowUser",
        sequelize: database
    }
);

FollowUser.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id', as: 'follower' });
FollowUser.belongsTo(User, { foreignKey: 'followed_user_id', targetKey: 'id', as: 'followed' });


//User.sync({ force: false }).then(() => console.log("FollowUser table ok!"));