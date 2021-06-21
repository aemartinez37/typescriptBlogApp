import { QueryInterface, DataTypes } from 'sequelize';

/**
 * function that sequelize-cli runs if you want to add this migration to your database
 * */

export async function up(query: QueryInterface) {
    try {
        return query.createTable("FollowUser", {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            user_id: {
                type: DataTypes.INTEGER,
                onDelete: "cascade",
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            },
            followed_user_id: {
                type: DataTypes.INTEGER,
                onDelete: "cascade",
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false
            },
        });
    } catch (e) {
        return Promise.reject(e);
    }
}

/**
 * function that sequelize-cli runs if you want to remove this migration from your database
 * */
export async function down(query: QueryInterface) {
    try {
        return query.dropTable("FollowUser");
    } catch (e) {
        return Promise.reject(e);
    }
}