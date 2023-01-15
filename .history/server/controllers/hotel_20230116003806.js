import Hotel from '../models/hotel';

export const create = async ( req, res ) =>
{

  // console.log( "req.fields", req.fields );
  // console.log( "req.files", req.files );
  try
  {

    let fileds = req.fileds;
    let files = req.files;

    let hotel = new Hotel( fields );


  } catch ( error )
  {
    console.log( error );
    res.status( 400 ).json( {
      error: error.message
    } );
  }

};