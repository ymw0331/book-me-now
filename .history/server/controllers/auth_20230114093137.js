export const showMessage = ( req, res ) =>
{
  res.status( 200 ).send( ` Here is your message: ${ req.params.message } ` );
};

export const register = async ( req, res ) =>
{
  try
  {
    const { name, email, password } = req.body;
    console.table( { name, email, password } );

  } catch ( err )
  {
    console.log( err );
  }
};
