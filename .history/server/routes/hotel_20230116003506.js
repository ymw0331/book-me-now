import express from "express";
import formidable from 'express-formidable';

const router = express.Router();

//middlewares
import { requireSignin } from "../middlewares/index";

//controllers
import { create } from '../controllers/hotel';


router.post( "/create-hotel", formidable(), requireSignin, create );



// export default router;
module.exports = router;