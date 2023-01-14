import User from '../models/user';
import jwt from 'jsonwebtoken';

export const register = async ( req, res ) =>
{
  // console.log( req.body );
  const { name, email, password } = req.body;

  //validation
  if ( !name )
    return res
      .status( 400 ).send( "Name is required" );

  if ( !email )
    return res
      .status( 400 ).send( "Email is required" );

  if ( !password || password.length < 6 )
    return res
      .status( 400 ).send( "Password is required and should be min 6 characters long" );


  let userExist = await User.findOne( { email } ).exec();
  if ( userExist ) return res.status( 400 ).send( "Email is taken. Please register another email address" );


  //register
  const user = new User( req.body );
  try
  {
    await user.save();
    console.log( "USER SAVED =>", user );
    return res.json( { ok: true } );

  } catch ( error )
  {
    console.log( "CREATE USER FAILED =>", error );
    return res.status( 400 ).send( "Error. Try again" );
  }
};


export const login = async ( req, res ) =>
{
  // console.log( req.body );
  const { email, password } = req.body;
  try
  {
    //check if user with that email exist
    let user = await User.findOne( { email } ).exec();
    // console.log( "USER EXIST => ", user );
    if ( !user ) res.status( 400 ).send( "User with this email not found" );

    //compare password
    user.comparePassword( password, ( err, match ) =>
    {
      console.log( "COMPARE PASSWORD IN LOGIN ERR ==>", err );
      if ( !match || err )
        return res.status( 400 ).send( "Wrong password" );
      // GENERATE A TOKEN THEN SEND A RESPONSE TO CLIENT
      let token = jwt.token( { _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
      } );

      res.json( { token, user } );

    } );



  } catch ( error )
  {
    console.log( "LOGIN ERROR =>", error );
    res.status( 400 ).send( "Signin failed." );

  }


};