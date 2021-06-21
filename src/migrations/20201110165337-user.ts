import { QueryInterface, DataTypes } from 'sequelize';

/**
 * function that sequelize-cli runs if you want to add this migration to your database
 * */

export async function up(query: QueryInterface) {
    try {
        return query.createTable("Users", {
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
        return query.dropTable("Users");
    } catch (e) {
        return Promise.reject(e);
    }
}