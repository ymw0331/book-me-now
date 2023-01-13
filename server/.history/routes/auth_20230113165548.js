import express from "express";

const router = express.Router();


app.get( '/api/:message', ( req, res ) =>
{
  res.status( 200 ).send( ` Here is your message: ${ req.params.message } ` );

} );