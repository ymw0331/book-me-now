import express from "express";

const router = express.Router();

//controllers
import { showMessage } from '../controllers/auth';

router.get( '/:message', showMessage );

router.post("/register", )





// export default router;
module.exports = router;