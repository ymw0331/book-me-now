import express from "express";
import formidable from 'express-formidable';

const router = express.Router();

//middlewares
import { requireSignin } from "../middlewares/index";

//controllers
import { create, hotels, image, sellerHotels, deleteHotel } from '../controllers/hotel';

router.post( "/create-hotel", formidable(), requireSignin, create );
router.get( "/hotels", hotels );
router.get( "/hotel/image/:hotelId", image );
router.get( "/seller-hotels", requireSignin, sellerHotels );
router.post( "/delete-hotel/:hotelId", remove );


// export default router;
module.exports = router;