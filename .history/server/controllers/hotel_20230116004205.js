import fs from 'fs';
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
    //handle image
    if ( files.image )
    {
      hotel.image.data = fs.readFileSync( files.image.path );
      hotel.image.contentType = files.image.type;
    }
    hotel.save( ( error, result ) =>
    {if(error)
      console.log( 'saving hotel error =>', error );
      res.staus( 400 ).send( "Error saving" );
    }
    
  } catch ( error )
  {
    console.log( error );
    res.status( 400 ).json( {
      error: error.message
    } );
  }

};