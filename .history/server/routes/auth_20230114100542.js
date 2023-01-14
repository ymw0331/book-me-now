import express from "express";

const router = express.Router();

//controllers
import { showMessage, register } from '../controllers/auth';

router.post( '/register', register );





// export default router;
module.exports = router;