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
                duration,
                logoUrl
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
                logoUrl,
                agentId: req.user.userId
            });

            // Generate PDF
            const doc = new PDFDocument({
                margins: {
                    top: 50,
                    bottom: 50,
                    left: 50,
                    right: 50
                }
            });
            const pdfPath = path.join(__dirname, '..', 'uploads', `contract-${contract.id}.pdf`);
            const pdfStream = fs.createWriteStream(pdfPath);

            doc.pipe(pdfStream);

            // Add logo to PDF if provided
            if (logoUrl) {
                try {
                    const logoPath = path.join(__dirname, '..', '..', 'Front', 'src', 'componenet', 'website', 'images', 'logo1.jpg');
                    if (fs.existsSync(logoPath)) {
                        // Position logo on the left
                        doc.image(logoPath, 50, 50, { width: 120 });
                        
                        // Add title next to the logo
                        doc.fontSize(24)
                           .font('Helvetica-Bold')
                           .text('Contract Details', 200, 85, {
                                align: 'left'
                           });

                        // Move cursor below logo and title
                        doc.moveDown(6);
                    }
                } catch (error) {
                    console.error('Error adding logo to PDF:', error);
                }
            }

            // Add content to PDF with improved formatting
            doc.font('Helvetica')
               .fontSize(12)
               .lineGap(10);

            // Create a function for consistent label formatting
            const addField = (label, value) => {
                doc.font('Helvetica-Bold')
                   .text(`${label}: `, {
                        continued: true,
                        lineGap: 10
                    })
                   .font('Helvetica')
                   .text(value);
            };

            // Add fields with consistent formatting
            addField('Type', type);
            addField('Client Name', clientName);
            addField('Client Email', clientEmail);
            addField('Client Address', clientAddress);
            addField('Duration', duration);
            addField('Start Date', startDate.toLocaleDateString());
            addField('End Date', endDate.toLocaleDateString());

            // Add space before description
            doc.moveDown(2);

            // Add description with proper formatting
            doc.font('Helvetica-Bold')
               .fontSize(14)
               .text('Description:', {
                    lineGap: 15
                });
            
            doc.font('Helvetica')
               .fontSize(12)
               .text(description, {
                    indent: 20,
                    align: 'justify',
                    lineGap: 10
                });

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