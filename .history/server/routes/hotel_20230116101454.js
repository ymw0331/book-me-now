import express from "express";
import formidable from 'express-formidable';

const router = express.Router();

//middlewares
import { requireSignin } from "../middlewares/index";

//controllers
import { create, hotels } from '../controllers/hotel';

router.post( "/create-hotel", formidable(), requireSignin, create );
router.get( "/hotels", hotels );
router.get( "/hotel/image/:hotelId", image ) ;

// export default router;
module.exports = router;