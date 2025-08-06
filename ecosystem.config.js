const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from the .env file in the project root
const env = dotenv.config({ path: path.resolve(__dirname, '.env') }).parsed || {};

module.exports = {
  apps: [
    {
      name: 'CO-Request-Admin', // A name for your application in PM2
      script: './src/serverco.js', // <-- IMPORTANT: Make sure this is your app's entry point
      env: {
        NODE_ENV: 'development',
        ...env, // Spread the variables from the .env file
      },
    },
  ],
};