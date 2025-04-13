const express = require("express")
const router = express.Router()
const {registerUser,loginUser,deleteUser,updateUser,currentUser,addedUser,getAllUsers}=require("../controller/user")
const authenticateJWT = require("../Auth/auth")
const upload = require('../config/multer')

router.post("/register",registerUser)
router.post("/login",loginUser)
router.post("/add",authenticateJWT,upload.single('image'),addedUser)
router.delete("/:id",authenticateJWT,deleteUser)
router.put("/:id",authenticateJWT,upload.single('image'),updateUser)
router.get("/current",authenticateJWT,currentUser)
router.get("/all",authenticateJWT,getAllUsers)

module.exports = router