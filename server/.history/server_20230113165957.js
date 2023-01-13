import router from './routes/auth';
import express from 'express';
import fs from "fs";

const app = express();

//router middleware
app.use( "/api", router );
fs.readdirSync( './route' ).map( ( r ) => app.use('/api', require) );


const port = process.env.PORT || 8000;

app.listen( port, () =>
{
  console.log( `Server is running on port ${ port }` );
} );