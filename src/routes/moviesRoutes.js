const express = require('express');
const router = express.Router();
const { list, newMovie, recommended, detail, search, add, create, edit, update, remove, destroy } = require('../controllers/moviesController');
const moviesAddValidator = require('../validations/moviesAddValidator');
const moviesEditValidator = require('../validations/moviesEditValidator');

router
    .get('/', list)
    .get('/new', newMovie)
    .get('/recommended', recommended)
    .get('/detail/:id', detail)
    .get('/search', search)

//Rutas exigidas para la creación del CRUD
    .get('/add', add)
    .post('/create', moviesAddValidator, create)
    .get('/edit/:id', edit)
    .put('/update/:id', moviesEditValidator, update)
    .get('/delete/:id', remove)
    .delete('/destroy/:id', destroy)

module.exports = router;