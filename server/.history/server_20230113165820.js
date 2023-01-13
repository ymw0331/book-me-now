import router from './routes/auth';
import express, { application } from 'express';



const app = express();

//router middleware
app.use( "/api", router );


const port = process.env.PORT || 8000;

app.listen( port, () =>
{
  console.log( `Server is running on port ${ port }` );
} );