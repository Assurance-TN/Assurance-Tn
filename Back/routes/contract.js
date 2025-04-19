const express = require("express");
const router = express.Router();
const {
    createContract,
    getContractsByAgent,
    getContractsByClient,
    signContract,
    getContractById,
    getAllContracts,
    getAvailableContracts
} = require("../controller/contract");
const authenticateJWT = require("../Auth/auth");
const multer = require('multer');
const path = require('path');

// Configure multer for signature uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '..', 'uploads');
        if (!require('fs').existsSync(uploadDir)) {
            require('fs').mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Agent routes
router.post("/create", authenticateJWT, createContract);
router.get("/agent", authenticateJWT, getContractsByAgent);
router.get("/all", authenticateJWT, getAllContracts);

// Client routes
router.get("/client", authenticateJWT, getContractsByClient);
router.get("/available", authenticateJWT, getAvailableContracts);
router.post("/:contractId/sign", authenticateJWT, upload.single('signature'), signContract);

// Common routes
router.get("/:contractId", authenticateJWT, getContractById);

module.exports = router; 