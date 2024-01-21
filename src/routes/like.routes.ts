import express, { Request, Response } from 'express';
import Like, { ILike } from '../models/Like';
import auth from '../middlewares/auth.middleware';

const router = express.Router({ mergeParams: true });

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    // const { orderBy, equalTo } = req.query;
    // const likes = await Like.find({ [orderBy]: equalTo });
    const likes: ILike[] = await Like.find();
    res.status(200).send(likes);
  } catch (error) {
    res.status(500).json({
      message: 'An error has occurred on the server. Please, try again later',
    });
  }
});

router.post('/', auth, async (req: Request, res: Response): Promise<void> => {
  try {
    const newLike: ILike = await Like.create({
      ...req.body,
      userId: req.body.user._id,
    });
    res.status(201).send(newLike);
  } catch (error) {
    res.status(500).json({
      message: 'An error has occurred on the server. Please, try again later',
    });
  }
});

router.delete('/:likeId', auth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { likeId } = req.params;
    const removedLike: ILike | null = await Like.findById(likeId);

    if (removedLike?.userId.toString() === req.body.user._id) {
      await removedLike?.deleteOne();
      // return res.send(null);
      // return res.send(removedLike);
      res.send(removedLike);
      return;
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
