import express from "express";

const router = express.Router();

//controllers
import {  } from '../controllers/stripe';

router.post( '/create-connect-account', createConnectAccount );



// export default router;
module.exports = router;