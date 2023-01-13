const express = require( "express" );

const app = express();

app.get( '/api/:message', ( req, res ) =>
{
  res.status().send( req.params.message );

} );

app.listen( 8000, () =>
{
  console.log( `Server is running on port 8000 || ${po}` );
} );