import { Router, Request, Response } from 'express';
import Joi from 'joi';

const router = Router();

// Promo codes configuration
const promoCodes: { [key: string]: { type: 'percentage' | 'flat'; value: number } } = {
  SAVE10: { type: 'percentage', value: 10 },
  FLAT100: { type: 'flat', value: 100 },
  WELCOME20: { type: 'percentage', value: 20 },
};

// Validation schema
const promoSchema = Joi.object({
  code: Joi.string().required(),
  subtotal: Joi.number().min(0).required(),
});

// POST /promo/validate - Validate promo code
router.post('/validate', async (req: Request, res: Response) => {
  try {
    const { error, value } = promoSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { code, subtotal } = value;
    const promo = promoCodes[code.toUpperCase()];

    if (!promo) {
      return res.status(404).json({
        success: false,
        message: 'Invalid promo code',
      });
    }

    let discount = 0;
    if (promo.type === 'percentage') {
      discount = (subtotal * promo.value) / 100;
    } else {
      discount = Math.min(promo.value, subtotal);
    }

    res.json({
      success: true,
      data: {
        code: code.toUpperCase(),
        type: promo.type,
        value: promo.value,
        discount: Math.round(discount * 100) / 100,
      },
    });
  } catch (error) {
    console.error('Error validating promo code:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate promo code',
    });
  }
});

export default router;
