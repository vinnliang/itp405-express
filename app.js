const express = require('express');
const knex = require('knex');
const app = express();
const Genre = require('./models/Genre');
let bookshelf = require('bookshelf');
bookshelf = bookshelf(connect());

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

app.get('/v2/genres', function(request, response)
{
  Genre.fetchAll().then(function()
  {
    response.json(genres);
  });
});

app.get('/v2/genres/:id', function(request, response)
{
  let id = request.params.id;
  let genre = new Genre({ GenreId: id});
  genre.fetch().then(function(genre)
  {
    if(!genre)
    {
      //response.status(404).json({error: `Genre ${id} not found`});
      throw new Error(`Genre ${id} not found`);
    } else
    {
      response.json(genre);
    }
  }).catch(function(error)
  {
      console.log(error);
      response.status(404).json({error: error.message });
  });
});

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

app.delete('/tracks/:id', function(req, res)
{

  const Tracks = bookshelf.Model.extend(
  {
    tableName: 'tracks',
    idAttribute: 'TrackId'
  });
  let id = req.params.id;
  let Track = new Tracks({ TrackId:id});
  Track.destroy().then(function(track)
  {
      if (!track)
      {
        throw new Error(`Track ${id} does not appear to exist`);
      } else
      {
        res.status(204).json(null);
      }
    }).catch(function(error)
    {
      res.status(404).json(
      {
        error: error.message
      });
    });
});

const port = process.env.PORT || 8000;

app.listen(port, function()
{
    console.log(`Listening on port ${port}`);
});
