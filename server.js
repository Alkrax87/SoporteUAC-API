const mongoose = require('mongoose');
const app = require("./src/app");

const PORT = process.env.PORT || 5000;
const dbURI = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`

const startServer = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log('MongoDB connected');

    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    })
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();