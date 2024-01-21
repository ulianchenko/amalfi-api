import express, { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import auth from '../middlewares/auth.middleware';

const router = express.Router({ mergeParams: true });

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const users: IUser[] = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).json({
      message: 'An error has occurred on the server. Please, try again later',
    });
  }
});

router.patch('/:userId', auth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    if (userId === req.body.user._id) {
      const updatedUser: IUser | null = await User.findByIdAndUpdate(userId, req.body, { new: true });
      res.send(updatedUser);
    } else {
      res.status(401).json({
        message: 'Unauthorized',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'An error has occurred on the server. Please, try again later',
    });
  }
});

export default router;