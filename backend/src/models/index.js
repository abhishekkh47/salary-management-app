'use strict';

const fs = require('fs');
const path = require('path');
const { DataTypes } = require('sequelize');
const database = require("../config/database");
const sequelize = database.getInstance();

const models = {};

const modelFiles = fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (
      file !== "index.js" &&
      file.endsWith(".model.js")
    );
  });

for (const file of modelFiles) {
  const ModelClass = require(path.join(__dirname, file));

  ModelClass.initialize(
    sequelize,
    DataTypes
  );

  models[ModelClass.name] = ModelClass;
}

Object.values(models).forEach((model) => {
  if (typeof model.associate === "function") {
    model.associate(models);
  }
});

module.exports = {
  sequelize,
  models
};
