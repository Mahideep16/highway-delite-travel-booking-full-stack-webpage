import { Router, Request, Response } from 'express';
import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';
import Booking from '../models/Booking';
import Slot from '../models/Slot';
import Experience from '../models/Experience';
import sequelize from '../config/database';

const router = Router();

// Validation schema
const bookingSchema = Joi.object({
  experienceId: Joi.string().uuid().required(),
  slotId: Joi.string().uuid().required(),
  fullName: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  quantity: Joi.number().integer().min(1).required(),
  promoCode: Joi.string().optional().allow(''),
  date: Joi.string().required(),
  time: Joi.string().required(),
});

// POST /bookings - Create a booking
router.post('/', async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction();

  try {
    // Validate request
    const { error, value } = bookingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { experienceId, slotId, fullName, email, quantity, promoCode } = value;

    // Get slot and check availability
    const slot = await Slot.findByPk(slotId, { transaction });
    if (!slot) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Slot not found',
      });
    }

    if (slot.availableSpots < quantity) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `Only ${slot.availableSpots} spots available`,
      });
    }

    // Get experience for price
    const experience = await Experience.findByPk(experienceId, { transaction });
    if (!experience) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Experience not found',
      });
    }

    // Calculate pricing
    const basePrice = parseFloat(experience.price.toString());
    const subtotal = basePrice * quantity;
    let discount = 0;

    if (promoCode) {
      const promoDiscount = validatePromoCode(promoCode, subtotal);
      discount = promoDiscount;
    }

    const taxRate = 0.05; // 5% tax
    const taxes = (subtotal - discount) * taxRate;
    const total = subtotal - discount + taxes;

    // Generate booking reference
    const bookingRef = generateBookingRef();

    // Create booking
    const booking = await Booking.create(
      {
        experienceId,
        slotId,
        fullName,
        email,
        quantity,
        promoCode: promoCode || undefined,
        discount,
        subtotal,
        taxes,
        total,
        bookingRef,
        status: 'confirmed',
      },
      { transaction }
    );

    // Update slot availability
    await slot.update(
      { availableSpots: slot.availableSpots - quantity },
      { transaction }
    );

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully',
      data: {
        bookingRef: booking.bookingRef,
        experienceName: experience.name,
        date: value.date,
        time: value.time,
        quantity,
        total: booking.total,
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
    });
  }
});

// Helper function to validate promo codes
function validatePromoCode(code: string, subtotal: number): number {
  const promoCodes: { [key: string]: { type: 'percentage' | 'flat'; value: number } } = {
    SAVE10: { type: 'percentage', value: 10 },
    FLAT100: { type: 'flat', value: 100 },
    WELCOME20: { type: 'percentage', value: 20 },
  };

  const promo = promoCodes[code.toUpperCase()];
  if (!promo) return 0;

  if (promo.type === 'percentage') {
    return (subtotal * promo.value) / 100;
  } else {
    return Math.min(promo.value, subtotal);
  }
}

// Helper function to generate booking reference
function generateBookingRef(): string {
  const prefix = 'HUF';
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}${random}`;
}

export default router;
