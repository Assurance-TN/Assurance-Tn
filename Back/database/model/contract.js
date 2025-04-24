module.exports = (sequelize, DataTypes) => {
const Contract = sequelize.define('Contract', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    type: {
        type: DataTypes.ENUM('SANTE', 'AUTO', 'SCOLAIRE', 'TRANSPORT_MARCHANDISE', 'VOYAGE', 'HABITATION', 'ACCIDENT'),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    nameAgent: {
        type: DataTypes.STRING,
        allowNull: false
    },
    emailAssurance: {
        type: DataTypes.STRING,
        allowNull: false
    },
    prix: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    adresseAssurance: {
        type: DataTypes.STRING,
        allowNull: false
    },
    duration: {
        type: DataTypes.ENUM('6_MONTHS', '1_YEAR'),
        allowNull: false
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'SIGNED', 'EXPIRED'),
        defaultValue: 'PENDING'
    },
    pdfUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    signatureUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    logoUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    // Client information (filled when signing)
    clientUserName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    clientEmail: {
        type: DataTypes.STRING,
        allowNull: true
    },
    clientPhone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    agentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    clientId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Users',
            key: 'id'
        }
    }
});
return Contract;
};

