const express = require("express");
import {login} from "./login";
import { refresh } from "./refresh";
import { authJWT } from "./auth";

const router = express.Router();

router.post("/login", login);
router.post("/refresh", refresh);
router.get('/test', authJWT);

export default router;

