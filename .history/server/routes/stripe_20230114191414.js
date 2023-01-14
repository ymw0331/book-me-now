import express from "express";

const router = express.Router();

import { requireSignin } from "../middlewares/index";

//controllers
import { createConnectAccount } from '../controllers/stripe';

router.post( '/create-connect-account', requireSignin, createConnectAccount );

// export default router;
module.exports = router;