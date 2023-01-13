import router from './routes/auth';
import express from 'express';



const app = express();


//router middleware


const port = process.env.PORT || 8000;

app.listen( port, () =>
{
  console.log( `Server is running on port ${ port }` );
} );