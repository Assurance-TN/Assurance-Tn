const { Sequelize,DataTypes } = require('sequelize');

const config = require('./config')

const connection = new Sequelize(
    config.development.database,
    config.development.username,
    config.development.password,
    {
        host: config.development.host,
        dialect: config.development.dialect
    }
);
db={}
db.Sequelize=Sequelize
db.connection=connection

// Import models
db.User = require("./model/user")(connection, DataTypes)
db.Contract = require("./model/Contract")(connection, DataTypes)

// Define associations
db.User.hasMany(db.Contract, { 
    foreignKey: 'agentId',
    as: 'agentContracts'
});
db.Contract.belongsTo(db.User, { 
    foreignKey: 'agentId',
    as: 'agent'
});

db.User.hasMany(db.Contract, { 
    foreignKey: 'clientId',
    as: 'clientContracts'
});
db.Contract.belongsTo(db.User, { 
    foreignKey: 'clientId',
    as: 'client'
});

connection.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

// Uncomment to sync database on startup (BE CAREFUL with force: true in production)
// connection.sync({force: true}).then(() => {
//     console.log('Database synced successfully');
// }).catch((error) => {
//     console.error('Error syncing database:', error);
// });

module.exports=db
