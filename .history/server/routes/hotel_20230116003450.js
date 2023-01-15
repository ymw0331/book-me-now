import express from "express";
import formidable from 'express-formidable';

const router = express.Router();
import { requireSignin } from "../middlewares/index";

//controllers
import { create } from '../controllers/hotel';


router.post( "/create-hotel", formidable(), create );



// export default router;
module.exports = router;