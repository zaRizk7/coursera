const express = require('express');

const Router = express.Router();

const Favorite = require('../models/favorites');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = Router();

favoriteRouter
	.route('/')
	.options(cors.corsWithOption, (req, res, next) => res.sendStatus(200))
	.get(cors.cors, authenticate.verifyUser, (res, req, next) => {
		Favorite.findOne({ user: req.user._id })
			.populate('user')
			.populate('dishes')
			.then((favorites) => {
				if (favorites) {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					return res.json(favorites);
				}
				res.statusCode = 404;
				return res.end('No favorites found!');
			})
			.catch((err) => next(err));
	})
	.post(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
		Favorite.findOne({ user: req.user._id })
			.then((favorites) => {
				if (!favorites) {
					Favorite.create({ user: req.user._id }).then((newFavorites) => {
						req.body.forEach((favorite) => {
							newFavorites.dishes.push(favorite);
						});
						newFavorites.save();
						res.statusCode = 200;
						return res.json(newfavorites);
					});
				} else {
					req.body.forEach((favorite) => {
						if (favorites.dishes.indexOf(favorite._id) === -1)
							favorites.dishes.push(favorite);
					});
				}
				favorites.save();
				res.statusCode = 200;
				return res.json(favorites);
			})
			.catch((err) => next(err));
	})
	.put(cors.corsWithOption, (req, res, next) => {
		res.statusCode = 403;
		return res.end('PUT operation not supported on /favorites');
	})
	.delete(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
		Favorite.deleteOne({ user: req.user._id })
			.then((result) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				return res.json(result);
			})
			.catch((err) => next(err));
	});

favoriteRouter
	.route('/:dishId')
	.options(cors.corsWithOption, (req, res, next) => res.sendStatus(200))
	.get(cors.cors, (req, res, next) => {
		res.statusCode = 403;
		return res.end(
			`GET operation not supported on /favorites/${res.params.dishId}`
		);
	})
	.post(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
		Favorite.findOne({ user: req.user._id }).then(
			(favorites) => {
				if (favorites) {
					favorites.dishes.push(req.body);
					favorites.save().then((result) => {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						return res.json(result);
					});
				} else {
					res.statusCode = 404;
					return res.end('Favorite list not found!');
				}
			},
			(err) => next(err)
		);
	})
	.put(cors.corsWithOption, (req, res, next) => {
		res.statusCode = 403;
		res.end(`PUT operation not supported on /favorites/${req.params.dishId}`);
	})
	.delete(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
		Favorite.findOne({ user: req.user._id }).then(
			(favorites) => {
				if (favorites) {
					const favoriteDish = favorites.dishes.id(req.params.dishId);
					if (favoriteDish) {
						favoriteDish.remove();
						favorites.save().then((result) => {
							res.statusCode = 200;
							res.setHeader('Content-Type', 'application/json');
							return res.json(result);
						});
					} else {
						res.statusCode = 404;
						return res.end(`Dish ${req.params.dishId} not found!`);
					}
				} else {
					res.statusCode = 404;
					return res.end('Favorite list not found!');
				}
			},
			(err) => next(err)
		);
	});

module.exports = favoriteRouter;
