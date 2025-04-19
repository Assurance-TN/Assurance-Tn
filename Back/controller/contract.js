const { Contract, User } = require("../database/connection");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

module.exports = {
    createContract: async (req, res) => {
        try {
            const {
                type,
                description,
                clientName,
                clientEmail,
                clientAddress,
                duration
            } = req.body;

            // Calculate start and end dates
            const startDate = new Date();
            const endDate = new Date();
            if (duration === '6_MONTHS') {
                endDate.setMonth(endDate.getMonth() + 6);
            } else {
                endDate.setFullYear(endDate.getFullYear() + 1);
            }

            // Create contract
            const contract = await Contract.create({
                type,
                description,
                clientName,
                clientEmail,
                clientAddress,
                duration,
                startDate,
                endDate,
                agentId: req.user.userId
            });

            // Generate PDF
            const doc = new PDFDocument();
            const pdfPath = path.join(__dirname, '..', 'uploads', `contract-${contract.id}.pdf`);
            const pdfStream = fs.createWriteStream(pdfPath);

            doc.pipe(pdfStream);

            // Add content to PDF
            doc.fontSize(20).text('Contract Details', { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).text(`Type: ${type}`);
            doc.text(`Client Name: ${clientName}`);
            doc.text(`Client Email: ${clientEmail}`);
            doc.text(`Client Address: ${clientAddress}`);
            doc.text(`Duration: ${duration}`);
            doc.text(`Start Date: ${startDate.toLocaleDateString()}`);
            doc.text(`End Date: ${endDate.toLocaleDateString()}`);
            doc.moveDown();
            doc.text('Description:');
            doc.text(description);

            doc.end();

            // Update contract with PDF URL
            contract.pdfUrl = `/uploads/contract-${contract.id}.pdf`;
            await contract.save();

            res.status(201).json({
                message: "Contract created successfully",
                contract
            });
        } catch (error) {
            console.error("Error creating contract:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    getContractsByAgent: async (req, res) => {
        try {
            const contracts = await Contract.findAll({
                where: { agentId: req.user.userId },
                include: [{
                    model: User,
                    as: 'client',
                    attributes: ['id', 'userName', 'email']
                }],
                order: [['createdAt', 'DESC']]
            });
            res.status(200).json(contracts);
        } catch (error) {
            console.error("Error fetching contracts:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    getContractsByClient: async (req, res) => {
        try {
            const contracts = await Contract.findAll({
                where: { clientId: req.user.userId },
                include: [{
                    model: User,
                    as: 'agent',
                    attributes: ['id', 'userName', 'email']
                }],
                order: [['createdAt', 'DESC']]
            });
            res.status(200).json(contracts);
        } catch (error) {
            console.error("Error fetching contracts:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    signContract: async (req, res) => {
        try {
            const { contractId } = req.params;
            const signatureFile = req.file;

            if (!signatureFile) {
                return res.status(400).json({ message: "Signature file is required" });
            }

            const contract = await Contract.findByPk(contractId);
            if (!contract) {
                return res.status(404).json({ message: "Contract not found" });
            }

            // Update contract with signature and client ID
            contract.signatureUrl = `/uploads/${signatureFile.filename}`;
            contract.clientId = req.user.userId;
            contract.status = 'SIGNED';
            await contract.save();

            res.status(200).json({
                message: "Contract signed successfully",
                contract
            });
        } catch (error) {
            console.error("Error signing contract:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    getContractById: async (req, res) => {
        try {
            const { contractId } = req.params;
            const contract = await Contract.findByPk(contractId, {
                include: [
                    {
                        model: User,
                        as: 'agent',
                        attributes: ['id', 'userName', 'email']
                    },
                    {
                        model: User,
                        as: 'client',
                        attributes: ['id', 'userName', 'email']
                    }
                ]
            });

            if (!contract) {
                return res.status(404).json({ message: "Contract not found" });
            }

            res.status(200).json(contract);
        } catch (error) {
            console.error("Error fetching contract:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    getAllContracts: async (req, res) => {
        try {
            if (req.user.role !== 'agent' && req.user.role !== 'admin') {
                return res.status(403).json({ message: "Access denied" });
            }

            const contracts = await Contract.findAll({
                include: [
                    {
                        model: User,
                        as: 'client',
                        attributes: ['id', 'userName', 'email']
                    },
                    {
                        model: User,
                        as: 'agent',
                        attributes: ['id', 'userName', 'email']
                    }
                ],
                order: [['createdAt', 'DESC']]
            });
            res.status(200).json(contracts);
        } catch (error) {
            console.error("Error fetching all contracts:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    getAvailableContracts: async (req, res) => {
        try {
            const contracts = await Contract.findAll({
                where: { 
                    clientId: null, // Only get contracts that haven't been assigned to a client
                    status: 'PENDING' // Only get pending contracts
                },
                include: [{
                    model: User,
                    as: 'agent',
                    attributes: ['id', 'userName', 'email']
                }],
                order: [['createdAt', 'DESC']]
            });
            res.status(200).json(contracts);
        } catch (error) {
            console.error("Error fetching available contracts:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}; 