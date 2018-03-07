const express = require('express');
const knex = require('knex');

const app = express();

app.get('/genres', function(request, response)
{
    let connection = connect();
    //Select * from genres
    //Promises go through a pending, resolved(success), or rejected(error)
    let promise = connection.select().from('genres');
    //pending
    promise.then(function(genres)
    {
        //success
        response.json(genres);
    }), function(err)
    {
        //error
        response.json(
        {
          error: 'Something went wrong when finding genres'
        });
    };

});

app.get('/genres/:id', function(request, response)
{
    let connection = connect();

    let id = request.params.id;
    let promise = connection
    .select()
    .from('genres')
    .where('GenreId', id)
    .first();

    promise.then(function(genre)
    {
        response.json(genre);
    });
});

app.get('/api/artists/:filter?', function(req, res, next)
{
  let connection = connect();
  let search = req.query.filter;
  if (search == '0' || !search)
  {
    next();
  }
  else
  {
    let promise = connection
    .select('ArtistId as id', 'name')
    .from('artists')
    .where('name', 'like', `%${search}%`);

    promise.then(function(artistFilter)
    {
        res.json(artistFilter);
    }), function(err)
    {
        res.json(
        {
          error: 'Something went wrong when finding artists'
        });
    };
  }
});

app.get('/api/artists', function(req, res)
{
  let connection = connect();
    let promise = connection.select('ArtistId as id', 'name').from('artists');
    promise.then(function(artists)
    {
        res.json(artists);
    }), function(err)
    {
        res.json(
        {
          error: 'Something went wrong when finding artists'
        });
    };
});

function connect()
{
  let connection = knex(
    {
        client:'sqlite3',
        connection:
        {
            filename:'./database.sqlite'
        }
    });

    return connection;
}

const port = process.env.PORT || 8000;

app.listen(port, function()
{
    console.log(`Listening on port ${port}`);
});
