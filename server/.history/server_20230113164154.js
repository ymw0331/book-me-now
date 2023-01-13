const express = require( "express" );

const app = express();

app.get( '/api/:message', ( req, res ) =>
{
  res.status().send(req.params.message)

} );