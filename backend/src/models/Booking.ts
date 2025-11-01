import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface BookingAttributes {
  id: string;
  experienceId: string;
  slotId: string;
  fullName: string;
  email: string;
  quantity: number;
  promoCode?: string;
  discount: number;
  subtotal: number;
  taxes: number;
  total: number;
  bookingRef: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

interface BookingCreationAttributes extends Optional<BookingAttributes, 'id' | 'status'> {}

class Booking extends Model<BookingAttributes, BookingCreationAttributes> 
  implements BookingAttributes {
  public id!: string;
  public experienceId!: string;
  public slotId!: string;
  public fullName!: string;
  public email!: string;
  public quantity!: number;
  public promoCode?: string;
  public discount!: number;
  public subtotal!: number;
  public taxes!: number;
  public total!: number;
  public bookingRef!: string;
  public status!: 'confirmed' | 'pending' | 'cancelled';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Booking.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    experienceId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    slotId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    promoCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    taxes: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    bookingRef: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM('confirmed', 'pending', 'cancelled'),
      defaultValue: 'confirmed',
    },
  },
  {
    sequelize,
    tableName: 'bookings',
    timestamps: true,
  }
);

export default Booking;
