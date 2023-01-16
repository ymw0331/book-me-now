import express from "express";
import formidable from 'express-formidable';

const router = express.Router();

//middlewares
import { requireSignin, hotelOwner } from "../middlewares/index";

//controllers
import { create, hotels, image, sellerHotels, remove, read, update } from '../controllers/hotel';

router.post( "/create-hotel", formidable(), requireSignin, create );
router.get( "/hotels", hotels );
router.get( "/hotel/image/:hotelId", image );
router.get( "/seller-hotels", requireSignin, sellerHotels );
router.delete( "/delete-hotel/:hotelId", requireSignin, hotelOwner, remove );
router.get( "/hotel/:hotelId", read );
router.put(  "/update-hotel/:hotelId",
  requireSignin,
  hotelOwner, formidable(), update
);


// export default router;
module.exports = router;