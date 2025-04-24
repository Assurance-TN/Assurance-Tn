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

// Function to generate PDF with or without signature
const generateContractPDF = async (contract, signaturePath = null) => {
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

    return new Promise((resolve, reject) => {
        doc.pipe(pdfStream);

        try {
            // Add logo
            const logoPath = path.join(__dirname, '..', '..', 'Front', 'src', 'componenet', 'website', 'images', 'logo1.jpg');
            if (fs.existsSync(logoPath)) {
                doc.image(logoPath, 50, 50, { width: 120 });
                doc.fontSize(24)
                   .font('Helvetica-Bold')
                   .text('Contract Details', 200, 85, {
                        align: 'left'
                   });
                doc.moveDown(6);
            }

            // Add content
            doc.font('Helvetica')
               .fontSize(12)
               .lineGap(10);

            // Add fields
            const addField = (label, value) => {
                doc.font('Helvetica-Bold')
                   .text(`${label}: `, {
                        continued: true,
                        lineGap: 10
                    })
                   .font('Helvetica')
                   .text(value || 'N/A');
            };

            // Contract Details
            doc.font('Helvetica-Bold')
               .fontSize(16)
               .text('Contract Information', { underline: true });
            doc.moveDown();

            addField('Type', contract.type);
            addField('Duration', contract.duration);
            addField('Prix', `${contract.prix} TND`);
            doc.moveDown();

            // Agent Information
            doc.font('Helvetica-Bold')
               .fontSize(16)
               .text('Agent Information', { underline: true });
            doc.moveDown();

            addField('Agent Name', contract.nameAgent);
            addField('Email Assurance', contract.emailAssurance);
            addField('Adresse Assurance', contract.adresseAssurance);
            doc.moveDown();

            // Client Information (if contract is signed)
            if (contract.clientUserName) {
                doc.font('Helvetica-Bold')
                   .fontSize(16)
                   .text('Client Information', { underline: true });
                doc.moveDown();

                addField('Client Name', contract.clientUserName);
                addField('Client Email', contract.clientEmail);
                addField('Client Phone', contract.clientPhone);
                doc.moveDown();
            }

            // Description
            doc.font('Helvetica-Bold')
               .fontSize(16)
               .text('Description', { underline: true });
            doc.moveDown();
            
            doc.font('Helvetica')
               .fontSize(12)
               .text(contract.description, {
                    indent: 20,
                    align: 'justify',
                    lineGap: 10
                });

            // Add signature if provided
            if (signaturePath && fs.existsSync(signaturePath)) {
                doc.moveDown(4);
                doc.font('Helvetica-Bold')
                   .fontSize(14)
                   .text('Client Signature:', {
                        lineGap: 15
                    });
                
                // Add signature image
                doc.image(signaturePath, {
                    width: 200,
                    align: 'left'
                });

                // Add signature date
                doc.moveDown();
                doc.font('Helvetica')
                   .fontSize(12)
                   .text(`Signed on: ${new Date().toLocaleDateString()}`, {
                        align: 'left'
                    });
            }

            doc.end();

            pdfStream.on('finish', () => {
                resolve(pdfPath);
            });

            pdfStream.on('error', (error) => {
                reject(error);
            });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    createContract: async (req, res) => {
        try {
            const {
                type,
                description,
                nameAgent,
                emailAssurance,
                prix,
                adresseAssurance,
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
                nameAgent,
                emailAssurance,
                prix,
                adresseAssurance,
                duration,
                startDate,
                endDate,
                logoUrl,
                agentId: req.user.userId
            });

            // Generate initial PDF
            await generateContractPDF(contract);

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

            // Get client information
            const client = await User.findByPk(req.user.userId);
            if (!client) {
                return res.status(404).json({ message: "Client not found" });
            }

            // Update contract with signature URL and client information
            contract.signatureUrl = `/uploads/${signatureFile.filename}`;
            contract.clientId = req.user.userId;
            contract.clientUserName = client.userName;
            contract.clientEmail = client.email;
            contract.clientPhone = client.numéroTéléphone;
            contract.status = 'SIGNED';

            // Generate new PDF with signature and client information
            const signaturePath = path.join(__dirname, '..', 'uploads', signatureFile.filename);
            await generateContractPDF(contract, signaturePath);

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