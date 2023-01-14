import express from "express";

const router = express.Router();

//controllers
import { register, login } from '../controllers/auth';

router.post( '/create-connect-account', register );




// export default router;
module.exports = router;