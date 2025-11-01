import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Experience from './Experience';

interface SlotAttributes {
  id: string;
  experienceId: string;
  date: Date;
  time: string;
  availableSpots: number;
  totalSpots: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SlotCreationAttributes extends Optional<SlotAttributes, 'id'> {}

class Slot extends Model<SlotAttributes, SlotCreationAttributes> implements SlotAttributes {
  public id!: string;
  public experienceId!: string;
  public date!: Date;
  public time!: string;
  public availableSpots!: number;
  public totalSpots!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Slot.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    experienceId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'experiences',
        key: 'id',
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    availableSpots: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalSpots: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'slots',
    timestamps: true,
  }
);

// Define associations
Experience.hasMany(Slot, { foreignKey: 'experienceId', as: 'slots' });
Slot.belongsTo(Experience, { foreignKey: 'experienceId', as: 'experience' });

export default Slot;
