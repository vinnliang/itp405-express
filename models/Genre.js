const express = require('express');
const knex = require('knex');
const app = express();
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

const Genre = bookshelf.Model.extend(
{
  tableName: 'genres',
  idAttribut: 'GenreId'
});

module.exports = Genre;
