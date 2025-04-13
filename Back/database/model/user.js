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
            type: DataTypes.ENUM('admin',"client","agent","superviseur"),
            defaultValue: 'client',
            allowNull: false,
        },
        imageUrl: {
            type: DataTypes.TEXT
        },
        CIN: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                len: [8, 8], // CIN should be exactly 8 characters
                isNumeric: true // Only numbers allowed
            }
        },
        adresse: {
            type: DataTypes.STRING,
            allowNull: false
        },
        numéroTéléphone: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: /^[0-9]{8}$/ // Tunisian phone number format (8 digits)
            }
        }
    }, { tableName: "Users", timestamps: true }
    )
    return User;
  };
  