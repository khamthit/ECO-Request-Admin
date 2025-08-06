// src/server.js
require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./config/db');
const PORT = process.env.PORT || 8048; // Now process.env.PORT will be loaded from .env

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});