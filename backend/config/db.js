import { Sequelize } from "sequelize";

const sequelize = new Sequelize("netflix_clone", "root", "Rishabh@123", {
  host: "localhost",
  dialect: "mysql",
  logging: false,  
});

// Sync models
async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully!");
    
    // Sync database tables
    await sequelize.sync({ alter: true });
    console.log("All models synchronized!");

  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

export { sequelize, connectDB };
