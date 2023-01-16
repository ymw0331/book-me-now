import express from "express";
import formidable from 'express-formidable';

const router = express.Router();

//middlewares
import { requireSignin } from "../middlewares/index";

//controllers
import { create, hotels, image, sellerHotels, delete } from '../controllers/hotel';

router.post( "/create-hotel", formidable(), requireSignin, create );
router.get( "/hotels", hotels );
router.get( "/hotel/image/:hotelId", image );
router.get( "/seller-hotels", requireSignin, sellerHotels );
router.post( "/delete-hotel", formidable(), requireSignin, delete );


// export default router;
module.exports = router;