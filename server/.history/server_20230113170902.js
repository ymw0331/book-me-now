import express from 'express';
import { readdirSync } from "fs";
require( 'dotenv' ).config();
import morgan from 'morgan';
const app = express();

//middlewares
app.use( morgan( "dev" ) );

//router middleware
readdirSync( './routes' ).map( ( r ) => app.use( '/api', require( `./routes/${ r }` ) ) ); //make all routes as middleware

const port = process.env.PORT || 8000;

app.listen( port, () =>
{
  console.log( `Server is running on port ${ port }` );
} );