const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      readOnly: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 50],
        is: /^[^\s\W\d]+$/,
      },
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 50],
        is: /^[^\s\W\d]+$/,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
      },
    },
  },
  {
    timestamps: true,
    createdAt: "account_created",
    updatedAt: "account_updated",
    freezeTableName: true,
  }
);

const User_Metadata = sequelize.define(
  "user_metadata",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      readOnly: true,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      readOnly: true,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

// creates table if does not exists
User.sync({ force: false });
User_Metadata.sync({ force: false });

User.beforeUpdate((user) => {
  // on update of the user object, set the account_updated field to the current date
  user.account_updated = new Date();

  // user id,account_created, and account_updated fields are read-only
  if (user.changed("id")) {
    throw new Error("It is read-only field.");
  }
});

module.exports = { User, User_Metadata };
