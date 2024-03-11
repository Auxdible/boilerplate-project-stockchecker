const { MongoClient } = require('mongodb');

const mongoClient = new MongoClient(process.env.DB);

try {
    mongoClient.connect().then(() => {
        console.log("Connected to MongoDB!");
    });
} catch (x) {
    console.error("Failed to connect to MongoDB.")
    console.error(x)
}
module.exports = mongoClient;