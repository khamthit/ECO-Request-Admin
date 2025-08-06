const { Sequelize } = require("sequelize");
const {
  DATABASE_NAME,
  USER_DATABASE,
  PASSWORD_DATABASE,
  URL_DATABASE,
  PORT_DATABASE,
} = require("./globalKey");

const sequelize = new Sequelize(DATABASE_NAME, USER_DATABASE, PASSWORD_DATABASE, {
  host: URL_DATABASE,
  port: PORT_DATABASE,
  dialect: "postgres",
  logging: false, // Set to console.log to see generated SQL.
  pool: {
    max: 50,
    min: 0,
    acquire: 50000, // Corresponds to connectionTimeoutMillis
    idle: 500000, // Corresponds to idleTimeoutMillis
  },
});


(async () => {
  try {
    await sequelize.authenticate();
    console.log(
      `Successfully connected to PostgreSQL database: ${DATABASE_NAME} on ${URL_DATABASE}:${PORT_DATABASE}`
    );
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

module.exports = {
  sequelize,
  Sequelize, // Exporting Sequelize class is a common practice
};