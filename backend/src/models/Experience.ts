import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ExperienceAttributes {
  id: string;
  name: string;
  location: string;
  description: string;
  image: string;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ExperienceCreationAttributes extends Optional<ExperienceAttributes, 'id'> {}

class Experience extends Model<ExperienceAttributes, ExperienceCreationAttributes> 
  implements ExperienceAttributes {
  public id!: string;
  public name!: string;
  public location!: string;
  public description!: string;
  public image!: string;
  public price!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Experience.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'experiences',
    timestamps: true,
  }
);

export default Experience;
