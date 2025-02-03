import express, { Request, Response } from 'express';

const router = express.Router({ mergeParams: true });

router.post('/', async (req: Request, res: Response): Promise<void> => {
  console.log('req from bx24:', req);

res.status(200).json({
    response: {
      message: 'Hi, the weather is greate',
    },
  });
});

export default router;
