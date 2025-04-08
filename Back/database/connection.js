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

db.User=require("./model/user")(connection, DataTypes)


connection.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

//     connection.sync({force: true}).then(() => {
//     console.log('Database synced successfully');
// }).catch((error) => {
//     console.error('Error syncing database:', error);
// });




module.exports=db
