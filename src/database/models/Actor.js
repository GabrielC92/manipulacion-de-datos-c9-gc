module.exports = (sequelize,dataTypes) => {

    let alias = 'Actor';

    let cols = {
        id: {
            type: dataTypes.INTEGER(10).UNSIGNED,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        first_name: {
            type: dataTypes.STRING(100),
            allowNull: false
        },
        last_name: {
            type: dataTypes.STRING(100),
            allowNull: false
        },
        rating: {
            type: dataTypes.DECIMAL(3,1),
            defaultValue: null
        },
        favorite_movie_id: {
            type: dataTypes.INTEGER(10).UNSIGNED,
            defaultValue: null
        }
    }

    let config = {
        tableName: 'actors',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: false,
        underscored: true
    }

    const Actor = sequelize.define(alias,cols,config);

    Actor.associate = models => {
        Actor.belongsTo(models.Movie, {
            as: 'movie',
            foreignKey: 'favorite_movie_id'
        });
        Actor.belongsToMany(models.Movie, {
            as: 'movies',
            through: 'actor_movie',
            foreignKey: 'actor_id',
            otherKey: 'movie_id'
        });
    }

    return Actor;
}