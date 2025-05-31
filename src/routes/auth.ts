import { Router } from "express";

import {
    createTestUser,
    getWalletConnectMessage,
    loginViaConnectWallet,
    // ZKAuthHandler,
    zkGetNonce,
    zkGetSalt,
} from "../controllers/authController";

const router = Router();

router.get("/zk/nonce", zkGetNonce);
router.post("/zk/salt", zkGetSalt);
router.get("/connect-message", getWalletConnectMessage);
router.post("/connect-wallet", loginViaConnectWallet);

router.post("/test-user", createTestUser);

// router.post("/zk", ZKAuthHandler);

export default router;
