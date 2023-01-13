import express from "express";

const router = express.Router();


router.get( '/api/:message', ( req, res ) =>
{
  res.status( 200 ).send( ` Here is your message: ${ req.params.message } ` );

} );


export default router;