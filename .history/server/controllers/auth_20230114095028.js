import User from '../models/user';

export const register = async ( req, res ) =>
{
  // console.log( req.body );
  const { name, email, password } = req.body;

  //validation
  if ( !name ) return res.stutus( 400 ).send( "Name is required" );
  if ( !password || password.length < 6 )


};
