import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      name: 'unique_email',
      msg: 'Email address must be unique.'
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  issubscriber: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  
} );

export default User;
