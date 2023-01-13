import express from "express";

const router = express.Router();

//controllers
import { showMessage } from '../controllers/auth';

router.get( '/:message', showMessage );





// export default router;
module.exports = router;