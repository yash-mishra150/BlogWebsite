import express from "express"
import UsersCtrl from "./users.controller.js"

const router = express.Router()

router.route("/login").post(UsersCtrl.apiLoginUser)
router.route("/register").post(UsersCtrl.apiAddUser)
router.route("/profile").get(UsersCtrl.apiGetUserByID)

export default router