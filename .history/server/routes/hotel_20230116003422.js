import express from "express";
import formidate

const router = express.Router();

//controllers
import { create } from '../controllers/hotel';


router.post( "/create-hotel", create );



// export default router;
module.exports = router;