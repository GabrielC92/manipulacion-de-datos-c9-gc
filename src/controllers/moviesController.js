const db = require('../database/models');
const sequelize = db.sequelize;
const {validationResult} = require('express-validator');

//Otra forma de llamar a los modelos
const Movies = db.Movie;

const moviesController = {
    list: (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
            .catch(error => console.log(error));
    },
    detail: (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            })
            .catch(error => console.log(error));
    },
    newMovie: (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            })
            .catch(error => console.log(error));
    },
    recommended: (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            })
            .catch(error => console.log(error));
    },
    search : (req,res) => {
        Movies.findAll({
            where: {
                [db.Sequelize.Op.or]: [{
                    title: {
                        [db.Sequelize.Op.substring]: req.query.keywords
                    }
                }]
            }
        })
            .then(movies => res.render('moviesResult',{
                title: 'Resultado de la búsqueda',
                movies,
                busqueda: req.query.keywords.trim()
            }))
            .catch(error => console.log(error));
    },
    //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: (req, res) => res.render('moviesAdd'),
    create: (req, res) => {
        let errors = validationResult(req);
        const {title,rating,awards,release_date,length} = req.body;

        if (errors.isEmpty()) {
            Movies.create({
                title: title.trim(),
                rating,
                awards,
                release_date,
                length
            })
                .then(movie => {
                    console.log(movie);
                    res.redirect('/movies')
                })
                .catch(error => console.log(error));
        } else {
            return res.render('moviesAdd',{
                errors: errors.mapped(),
                old: req.body
            })
        }
    },
    edit: (req, res) => {
        Movies.findByPk(req.params.id)
            .then(Movie => res.render('moviesEdit',{
                Movie
            }))
            .catch(error => console.log(error));
    },
    update: (req, res) => {
        let errors = validationResult(req);

        if (errors.isEmpty()) {
            Movies.update({
                ...req.body
            },
            {
                where: {
                    id: req.params.id
                }
            })
                .then(() => res.redirect('/movies'))
                .catch(error => console.log(error));
        } else {
            Movies.findByPk(req.params.id)
                .then(Movie => {
                    return res.render('moviesEdit',{
                        errors: errors.mapped(),
                        old: req.body,
                        Movie
                    })
                })
                .catch(error => console.log(error));
        }
    },
    remove: (req, res) => {
        Movies.findByPk(req.params.id)
        .then(Movie => res.render('moviesDelete',{
            Movie
        }))
        .catch(error => console.log(error));
    },
    destroy: (req, res) => {
        Movies.destroy({
            where: {
                id: req.params.id
            }
        })
            .then(() => res.redirect('/movies'))
            .catch(error => console.log(error));
    }

}

module.exports = moviesController;