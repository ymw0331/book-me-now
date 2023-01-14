import express from "express";

const router = express.Router();

//controllers
import { register } from '../controllers/auth';

router.post( '/register', register );

router.post( '/register', register );




// export default router;
module.exports = router;