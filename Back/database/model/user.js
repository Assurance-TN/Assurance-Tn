module.exports = (connection, DataTypes) => {
   
    const User = connection.define(
      "Users",
      {
        userName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            isEmail: true, 
            allowNull: false
                
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM('admin',"client","Manager","Employe"),
            defaultValue: 'client',
            allowNull: false,
        },
        imageUrl: {
            type: DataTypes.TEXT
          }
    }, { tableName: "Users", timestamps: true } ,
      
   
    )
    return User;
  };
  