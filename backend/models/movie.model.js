import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Movie = sequelize.define('Movie', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  stream_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export default Movie;
