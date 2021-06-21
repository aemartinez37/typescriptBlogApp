import { QueryInterface, DataTypes } from 'sequelize';

/**
 * function that sequelize-cli runs if you want to add this migration to your database
 * */

export async function up(query: QueryInterface) {
    try {
        return query.createTable("Microposts", {
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
            title: {
                type: new DataTypes.STRING(255),
                allowNull: false
            },
            text: {
                type: new DataTypes.STRING(500),
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
        return query.dropTable("Microposts");
    } catch (e) {
        return Promise.reject(e);
    }
}