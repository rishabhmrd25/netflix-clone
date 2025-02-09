import express from 'express';
import {signup , login , logout, updateSubscriptionStatus } from '../controllers/auth.controller.js'


const router = express.Router();

router.post("/signup",signup );
router.post("/login",login );
router.post("/logout", logout);
router.post("/subscribe", updateSubscriptionStatus);

export default router;

