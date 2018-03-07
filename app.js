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
          error: 'Something wwent wrong when finding genres'
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
