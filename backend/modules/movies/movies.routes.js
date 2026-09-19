const express = require('express');
const { searchMoviesHandler, nowPlayingHandler } = require('./movies.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: Movie search backed by TMDB
 */

/**
 * @swagger
 * /movies/search:
 *   get:
 *     summary: Search movies
 *     description: Searches TMDB for movies by title, genre, and/or release year. Works without login. Returns an empty array when nothing matches.
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Movie title to search for
 *         example: Fight Club
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Genre name (e.g. Action, Comedy, Drama)
 *         example: Drama
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Release year
 *         example: 1999
 *     responses:
 *       200:
 *         description: Matching movies (empty array if no matches)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   tmdbId:
 *                     type: integer
 *                     example: 550
 *                   title:
 *                     type: string
 *                     example: Fight Club
 *                   releaseYear:
 *                     type: integer
 *                     example: 1999
 *                   posterUrl:
 *                     type: string
 *                     nullable: true
 *                   overview:
 *                     type: string
 *                   voteAverage:
 *                     type: number
 *       500:
 *         description: Movie search failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.get('/search', searchMoviesHandler);

/**
 * @swagger
 * /movies/now-playing:
 *   get:
 *     summary: Movies now playing in Finnish cinemas
 *     description: Returns movies currently playing in cinemas for the given region (default FI). Works without login. Returns an empty array when nothing is playing.
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: region
 *         schema:
 *           type: string
 *         description: ISO 3166-1 region code
 *         example: FI
 *     responses:
 *       200:
 *         description: Movies currently playing (empty array if none)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   tmdbId:
 *                     type: integer
 *                     example: 550
 *                   title:
 *                     type: string
 *                     example: Fight Club
 *                   releaseYear:
 *                     type: integer
 *                     example: 1999
 *                   posterUrl:
 *                     type: string
 *                     nullable: true
 *                   overview:
 *                     type: string
 *                   voteAverage:
 *                     type: number
 *       500:
 *         description: Failed to fetch now-playing movies
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.get('/now-playing', nowPlayingHandler);

module.exports = router;
