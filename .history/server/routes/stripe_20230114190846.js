import express from "express";
import 


import { createConnectAccount } from '../controllers/stripe';

router.post( '/create-connect-account', createConnectAccount );

// export default router;
module.exports = router;