// default value - if process.env doesnt have jwt secret var then use jwtsecret
const { JWT_SECRET = "your-secret-key-here" } = process.env; // Replace with your actual secret key

module.exports = { JWT_SECRET };
