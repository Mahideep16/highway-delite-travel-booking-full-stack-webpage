import { Router, Request, Response } from 'express';
import Experience from '../models/Experience';
import Slot from '../models/Slot';

const router = Router();

// GET /experiences - Get all experiences
router.get('/', async (req: Request, res: Response) => {
  try {
    const experiences = await Experience.findAll({
      attributes: ['id', 'name', 'location', 'description', 'image', 'price'],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: experiences,
    });
  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch experiences',
    });
  }
});

// GET /experiences/:id - Get experience details with slots
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const experience = await Experience.findByPk(id, {
      include: [
        {
          model: Slot,
          as: 'slots',
          attributes: ['id', 'date', 'time', 'availableSpots', 'totalSpots'],
          where: {
            availableSpots: {
              [require('sequelize').Op.gt]: 0,
            },
          },
          required: false,
        },
      ],
    });

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found',
      });
    }

    res.json({
      success: true,
      data: experience,
    });
  } catch (error) {
    console.error('Error fetching experience:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch experience details',
    });
  }
});

export default router;
