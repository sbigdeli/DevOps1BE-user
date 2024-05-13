import { Router } from "express"
import { login, register, logout, verifyToken } from "../controllers/account"
import { verifyAPIKeyMiddleware } from "../middleware/apikey"

const router: Router = Router()

router.post("/account/login", login)

router.post("/account/", register)

router.post("/account/logout", logout)

router.get("/private/session", verifyAPIKeyMiddleware, verifyToken)

export default router