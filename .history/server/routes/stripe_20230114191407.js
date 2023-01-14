import express from "express";

const router = express.Router();

import {requireSignin} from "../"

//controllers
import { createConnectAccount } from '../controllers/stripe';

router.post( '/create-connect-account', requireSignin, createConnectAccount );

// export default router;
module.exports = router;