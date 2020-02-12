// const crypto = require('crypto')
const Sequelize = require("sequelize");
const db = require("../db");

const User = db.define("user", {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
    // defaultValue: 'GUEST'
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
    // defaultValue: 'GUEST'
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    },
    // Making `.password` act like a func hides it when serializing to JSON.
    // This is a hack to get around Sequelize's lack of a "private" option.
    get() {
      return () => this.getDataValue("password");
    }
  },
  salt: {
    type: Sequelize.STRING,
    // Making `.salt` act like a function hides it when serializing to JSON.
    // This is a hack to get around Sequelize's lack of a "private" option.
    get() {
      return () => this.getDataValue("salt");
    }
  },
  imageUrl: {
    type: Sequelize.STRING,
    defaultValue: "../../../assets/images/placeholder.png"
  },
  userStatus: {
    type: Sequelize.ENUM("member", "admin"),
    allowNull: false,
    defaultValue: "member"
  },
  points: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  textColor: {
    type: Sequelize.STRING,
    defaultValue: "black"
  }
});

module.exports = User;
