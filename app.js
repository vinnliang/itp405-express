const express = require('express');
const knex = require('knex');
const connect = require('./connect');
const app = express();

const Genre = require('./models/Genre');

app.get('/v2/genres', function(request, response) {
  Genre.fetchAll().then(function(genres) {
    response.json(genres);
  });
});

app.get('/v2/genres/:id', function(request, response) {
  let id = request.params.id;
  let genre = new Genre({ GenreId: id });
  genre.fetch()
    .then(function(genre) {
      if (!genre) {
        throw new Error(`Genre ${id} not found`);
      } else {
        response.json(genre);
      }
    })
    // .then(null, function(error) {})
    .catch(function(error) {
      response.status(404).json({
        error: error.message
      });
    });
});

app.get('/genres', function(request, response) {
  let connection = connect();
  // SELECT * FROM genres
  // 3 states of promises: pending, resolved (success), rejected (error)
  let promise = connection.select().from('genres');
  // pending
  promise.then(function(genres) {
    // success
    response.json(genres);
  }, function(err) {
    // error
    response.json({
      error: 'Something went wrong when finding genres'
    });
  });
});

app.get('/genres/:id', function(request, response) {
  let connection = connect();
  let id = request.params.id;

  // SELECT * FROM genres WHERE GenreId = ?
  let promise = connection
    .select()
    .from('genres')
    .where('GenreId', id)
    .first();

  promise.then(function(genre) {
    response.json(genre);
  }, function() {
    // response.json({
    //   error: 'Cannot find genre ' + id
    // });
  });
});

const port = process.env.PORT || 8000;
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
