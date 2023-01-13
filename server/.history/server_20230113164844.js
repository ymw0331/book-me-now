const express = require( "express" );

const app = express();

app.get( '/api/:message', ( req, res ) =>
{
  res.status().send( req.params.message );

} );


const port = process.env.PORT || 8000;

app.listen( port, () =>
{
  console.log( `Server is running on port ${ port }` );
} );