import express from "express";

const router = express.Router();


router.get( '/:message', ( req, res ) =>
{
  res.status( 200 ).send( ` Here is your message: ${ req.params.message } ` );

} );


export default router;