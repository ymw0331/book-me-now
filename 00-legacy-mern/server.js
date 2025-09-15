
import express from 'express';
import mongoose from 'mongoose';
import { readdirSync } from 'fs';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();
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
const routeFiles = readdirSync('./routes');
for (const file of routeFiles) {
  const route = await import(`./routes/${file}`);
  app.use('/api', route.default);
}

const port = process.env.PORT || 8000;

app.listen( port, () =>
{
  console.log( `Server is running on port ${ port }` );
} );