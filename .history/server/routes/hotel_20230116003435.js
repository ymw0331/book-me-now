import express from "express";
import fomidable from 'express-formidable';

const router = express.Router();

//controllers
import { create } from '../controllers/hotel';


router.post( "/create-hotel", formdible(), create );



// export default router;
module.exports = router;