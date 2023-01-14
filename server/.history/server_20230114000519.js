import express from 'express';
import mongoose from 'mongoose';
import { readdirSync } from "fs";
import cors from 'cors';

require( 'dotenv' ).config();
const morgan = require( "morgan" );
const app = express();

mongoose.set( 'strictQuery', true );

//MongDB
mongoose.connect( process.env.MONGO_URI )
  .then( () => console.log( "MongoDB Connected" ) )
  .catch( ( err ) => console.log( "DB Error => ", err ) );


//middlewares
app.use( cors() );
app.use( morgan( "dev" ) );
app.use( express.json() );

//router middleware
readdirSync( './routes' ).map( ( r ) => app.use( '/api', require( `./routes/${ r }` ) ) ); //make all routes as middleware

const port = process.env.PORT || 8000;

app.listen( port, () =>
{
  console.log( `Server is running on port ${ port }` );
} );