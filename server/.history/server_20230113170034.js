import router from './routes/auth';
import express from 'express';
import fs from "fs";

const app = express();

//router middleware
fs.readdirSync( './route' ).map( ( r ) => app.use( '/api', require( '/routes/${r}' ) ) ); //make all routes as middleware
app.use( "/api", router );


const port = process.env.PORT || 8000;

app.listen( port, () =>
{
  console.log( `Server is running on port ${ port }` );
} );